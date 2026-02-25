package com.example.suwmp_be.dto.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
