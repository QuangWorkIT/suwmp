package com.example.suwmp_be.dto;

import com.example.suwmp_be.constants.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
    @NotBlank String fullName,
    @Email @NotBlank String email,
    @NotBlank String password,
    Role role
) {

}
