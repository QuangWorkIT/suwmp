package com.example.suwmp_be.security;

import com.example.suwmp_be.repository.EnterpriseUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class EnterpriseScopeAuthorizationFilter extends OncePerRequestFilter {

    private static final Pattern SERVICE_AREA_PATH =
            Pattern.compile("^/api/v1/enterprises/(?<enterpriseId>\\d+)/service-areas/?$");

    private final EnterpriseUserRepository enterpriseUserRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        Matcher matcher = SERVICE_AREA_PATH.matcher(request.getRequestURI());
        if (!matcher.matches()) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UUID userId)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        boolean isEnterprise = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ENTERPRISE".equals(a.getAuthority()));

        if (!isEnterprise) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        Long enterpriseId = Long.parseLong(matcher.group("enterpriseId"));
        boolean allowed = enterpriseUserRepository.existsByEnterpriseIdAndUserId(enterpriseId, userId);
        if (!allowed) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        filterChain.doFilter(request, response);
    }
}

