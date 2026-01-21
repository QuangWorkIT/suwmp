package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.RoleEnum;
import com.example.suwmp_be.dto.request.LoginRequest;
import com.example.suwmp_be.dto.request.RegisterRequest;
import com.example.suwmp_be.dto.response.TokenResponse;
import com.example.suwmp_be.entity.Token;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.exception.InvalidCredential;
import com.example.suwmp_be.repository.TokenRepository;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.security.JwtUtil;
import com.example.suwmp_be.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final RoleCacheService roleCacheService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

    @Override
    public TokenResponse login(LoginRequest req) {
        System.out.println(req.getEmail() + " ");
        User user = userRepository.findByEmail(req.getEmail());
        System.out.println(user);
        if (user == null) {
            throw new InvalidCredential("User not found");
        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())){
            throw new InvalidCredential("Invalid password");
        }
        Token refreshToken = new Token(user, UUID.randomUUID().toString());
        tokenRepository.save(refreshToken);
        return new TokenResponse(jwtUtil.generateToken(user), refreshToken.getTokenId());
    }
}

