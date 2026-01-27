package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {
    Page<UserResponse> getAllUsers(Pageable pageable);
}
