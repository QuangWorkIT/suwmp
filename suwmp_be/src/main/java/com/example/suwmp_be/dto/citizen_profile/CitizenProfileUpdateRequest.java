package com.example.suwmp_be.dto.citizen_profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CitizenProfileUpdateRequest(
        @NotBlank(message = "Full name is required")
        @Pattern(
                regexp = "^[A-Za-zÀ-ỹà-ỹ]+(?:\\s[A-Za-zÀ-ỹà-ỹ]+)*$",
                message = "Full name must contain valid characters"
        )
        String fullName,

        @NotBlank(message = "Phone is required")
        @Pattern(
                regexp = "^(0|\\+84)[0-9]{9}$",
                message = "Invalid phone number"
        )
        String phone,

        @NotBlank(message = "Email is required")
        @Email
        String email
) { }
