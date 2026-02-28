package com.example.suwmp_be.dto.google_auth;

public record GoogleRegisterResponse(
        String to,
        String fullName,
        String password
) { }
