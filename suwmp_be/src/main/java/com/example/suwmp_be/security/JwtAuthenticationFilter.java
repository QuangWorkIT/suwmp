package com.example.suwmp_be.security;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // No Authorization header → treat as anonymous (public endpoints)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();

        // Token present but invalid → 401
        if (token.isEmpty() || !jwtUtil.validateJwtToken(token)) {
            writeAuthError(response, ErrorCode.ACCESS_TOKEN_INVALID);
            return;
        }

        String userId = jwtUtil.getUserFromToken(token);
        String role = jwtUtil.getClaim(token, "role");


        UUID principalId;
        try {
            principalId = UUID.fromString(userId);
        } catch (IllegalArgumentException ex) {
            writeAuthError(response, ErrorCode.USER_ID_INVALID);
            return;
        }

        var authentication = new UsernamePasswordAuthenticationToken(
                principalId,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }

    private void writeAuthError(HttpServletResponse response, ErrorCode errorCode)
            throws IOException {

        SecurityContextHolder.clearContext();

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        new ObjectMapper().writeValue(
                response.getOutputStream(),
                new BaseResponse<>(false, errorCode.getMessage())
        );
    }

}

