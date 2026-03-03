package com.example.suwmp_be.dto.google_auth;

import jakarta.validation.constraints.NotNull;

public record GoogleLoginRequest(
        @NotNull
        String idToken
) { }
