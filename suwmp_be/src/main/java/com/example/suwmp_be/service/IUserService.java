package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.CreateUserRequest;
import com.example.suwmp_be.dto.request.UpdateUserRequest;
import com.example.suwmp_be.dto.response.UserResponse;
import com.example.suwmp_be.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IUserService {
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse createUser(CreateUserRequest request);
    UserResponse updateUser(UUID userId, UpdateUserRequest request);
    void deleteUser(UUID userId);
}
