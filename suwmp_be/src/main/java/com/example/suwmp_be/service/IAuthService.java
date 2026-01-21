package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.RegisterRequest;
import com.example.suwmp_be.entity.User;

import java.util.UUID;

public interface IAuthService {
    UUID register(RegisterRequest req);
}
