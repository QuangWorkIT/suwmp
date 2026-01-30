package com.example.suwmp_be.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring("Bearer ".length()).trim();
        if (token.isEmpty() || !jwtUtil.validateJwtToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String userId = jwtUtil.getUserFromToken(token);
        String role = jwtUtil.getClaim(token, "role");

        if (userId == null || role == null) {
            filterChain.doFilter(request, response);
            return;
        }

        UUID principalId;
        try {
            principalId = UUID.fromString(userId);
        } catch (IllegalArgumentException ex) {
            // Malformed UUID in token subject – treat as unauthenticated
            filterChain.doFilter(request, response);
            return;
        }

        // Principal: UUID; Authority: ROLE_{roleName}
        var auth = new UsernamePasswordAuthenticationToken(
                principalId,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        filterChain.doFilter(request, response);
    }
}

