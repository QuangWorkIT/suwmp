package com.example.suwmp_be.dto.google_auth;

public record GoogleUserInfo(
        String email,
        String fullName,
        String pictureUrl,
        boolean emailVerified
) { }
