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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService
{

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final RoleCacheService roleCacheService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public UUID register(RegisterRequest req)
    {

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
    public TokenResponse login(LoginRequest req)
    {
        User user = userRepository.findByEmail(req.getEmail());
        if (user == null)
        {
            throw new InvalidCredential("User not found");
        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash()))
        {
            throw new InvalidCredential("Invalid password");
        }
        Token refreshToken = generateRefreshToken(user);
        return new TokenResponse(jwtUtil.generateToken(user), refreshToken.getTokenId());
    }

    @Override
    @Transactional
    public TokenResponse refreshToken(String refreshToken) {
        Token oldToken = tokenRepository
                .findTokenByTokenId(refreshToken)
                .orElseThrow(() -> new InvalidCredential("Invalid refresh token"));
        if (LocalDateTime.now().isAfter(oldToken.getExpiredAt())){
            throw new InvalidCredential("Refresh token expired");
        }

        User user = oldToken.getUser();

        tokenRepository.deleteTokenByTokenId(oldToken.getTokenId());
        Token newToken = generateRefreshToken(user);

        String newAccessToken = jwtUtil.generateToken(user);

        return new TokenResponse(newAccessToken, newToken.getTokenId());
    }

    @Override
    public Token generateRefreshToken(User user)
    {
        Token token = new Token(user, UUID.randomUUID().toString());
        token.setExpiredAt(LocalDateTime.now().plusDays(7));
        return tokenRepository.save(token);
    }
}

