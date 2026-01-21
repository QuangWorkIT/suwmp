package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.RoleEnum;
import com.example.suwmp_be.dto.RegisterRequest;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final RoleCacheService roleCacheService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UUID register(RegisterRequest req) {

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

        return userRepository.save(user).getId();
    }
}

