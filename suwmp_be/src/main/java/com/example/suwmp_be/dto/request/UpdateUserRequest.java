package com.example.suwmp_be.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String fullName;

    @Email
    private String email;

    private String phone;
    private int roleId;

    @Pattern(regexp = "^(ACTIVE|SUSPENDED)$")
    private String status;
}
