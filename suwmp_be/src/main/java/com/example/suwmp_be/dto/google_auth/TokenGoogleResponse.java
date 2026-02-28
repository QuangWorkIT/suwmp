package com.example.suwmp_be.dto.google_auth;

public record TokenGoogleResponse(
        String accessToken,
        String refreshToken
) { }
