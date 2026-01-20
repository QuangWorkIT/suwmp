package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.RegisterRequest;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AuthService {
    private final UserRepository userRepository = null;
    private final PasswordEncoder passwordEncoder = null;

    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setPassword(req.phoneNumber());
        user.setPassword(passwordEncoder.encode(req.password()));

        userRepository.save(user);
    }
}
