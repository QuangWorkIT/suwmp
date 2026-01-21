package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.LoginRequest;
import com.example.suwmp_be.dto.request.RegisterRequest;
import com.example.suwmp_be.dto.response.TokenResponse;

import java.util.UUID;

public interface IAuthService {
    UUID register(RegisterRequest req);
    TokenResponse login(LoginRequest req);
}
