package com.example.suwmp_be.dto.google_auth;

public record GoogleLoginResponse(
        String accessToken,
        String refreshToken
) {
}
