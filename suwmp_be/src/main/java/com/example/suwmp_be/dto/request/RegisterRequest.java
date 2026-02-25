package com.example.suwmp_be.dto.request;

import com.example.suwmp_be.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String fullName,
        @Email String email,

        @NotBlank
        @Pattern(
                regexp = "^(\\+84|0)[0-9]{9}$",
                message = "Invalid Vietnamese phone number"
        )
        String phone,

        @NotBlank
        @Size(min = 8)
        String password,

        Role role
) {

}

