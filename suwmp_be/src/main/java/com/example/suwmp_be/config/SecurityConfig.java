package com.example.suwmp_be.config;

import com.example.suwmp_be.dto.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.suwmp_be.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final Environment environment;

    @Value("${storage.mode:aws}")
    private String storageMode;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {
        return http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/actuator/**",
                                "/api/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers("/api/s3/files/**").access((authentication, context) -> {
                            boolean isDev = Arrays.asList(environment.getActiveProfiles()).contains("dev");
                            boolean isLocal = "local".equalsIgnoreCase(storageMode);
                            return new org.springframework.security.authorization.AuthorizationDecision(isDev || isLocal);
                        })
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex
                        // 401 – not authenticated
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json");
                            MAPPER.writeValue(
                                    res.getOutputStream(),
                                    new BaseResponse<>(false, "Unauthorized")
                            );
                        })
                        // 403 – authenticated but no permission
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.setContentType("application/json");
                            MAPPER.writeValue(
                                    res.getOutputStream(),
                                    new BaseResponse<>(false, "Access denied")
                            );
                        })
                )
                .build();
    }
}
