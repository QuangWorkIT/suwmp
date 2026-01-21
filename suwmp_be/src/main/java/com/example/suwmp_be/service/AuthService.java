package com.example.suwmp_be.service;

import com.example.suwmp_be.constants.RoleEnum;
import com.example.suwmp_be.dto.RegisterRequest;
import com.example.suwmp_be.entity.Role;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.repository.RoleRepository;
import com.example.suwmp_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleCacheService roleCacheService;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest req) {

        if (userRepository.existsByEmail(req.email())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByPhone(req.phone())) {
            throw new RuntimeException("Phone already exists");
        }


        User user = new User();
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setPhone(req.phone());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(roleCacheService.get(RoleEnum.CITIZEN));
        user.setStatus("ACTIVE");

        userRepository.save(user);
    }
}

