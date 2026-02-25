package com.example.suwmp_be.dto.forgot_password;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record VerifyEmailRequest(
        @NotEmpty(message = "Must not be empty")
        @Email
        String email) {
}
