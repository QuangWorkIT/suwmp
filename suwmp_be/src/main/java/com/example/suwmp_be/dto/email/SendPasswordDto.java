package com.example.suwmp_be.dto.email;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record SendPasswordDto(
        @NotNull
        @Email
        String to,

        @NotNull
        String fullName,

        @NotNull
        String password
) { }
