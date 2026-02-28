package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.constants.RoleEnum;
import com.example.suwmp_be.constants.UserStatus;
import com.example.suwmp_be.dto.google_auth.*;
import com.example.suwmp_be.entity.Role;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.exception.AuthenticationException;
import com.example.suwmp_be.exception.BadRequestException;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.RoleRepository;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.security.JwtUtil;
import com.example.suwmp_be.service.IGoogleAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoogleAuthServiceImpl implements IGoogleAuthService {
    @Value("${GOOGLE_CLIENT_ID:suwmp_secret_key_for_google_client_id_validation}")
    String googleClientId;

    final UserRepository userRepository;
    final JwtUtil jwtUtil;
    final AuthService authService;
    final PasswordEncoder passwordEncoder;
    final RoleRepository roleRepository;

    @Override
    public GoogleLoginResponse loginByGoogle(GoogleLoginRequest request) {
        GoogleUserInfo googleUserInfo = verifyIdToken(request.idToken());

        User user = userRepository.findByEmail(googleUserInfo.email());
        if (user == null)
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);

        if (user.getStatus() == null ||
                user.getStatus().equals(UserStatus.INACTIVE.toString()) ||
                user.getStatus().equals(UserStatus.SUSPENDED.toString()) ||
                user.getDeletedAt() != null)
            throw new AuthenticationException(ErrorCode.USER_INACTIVE);

        log.info("Login by Google successfully: {}", googleUserInfo.email());

        return new GoogleLoginResponse(
                jwtUtil.generateToken(user),
                authService.generateRefreshToken(user).getTokenId()
        );
    }

    @Override
    @Transactional
    public GoogleRegisterResponse registerByGoogle(GoogleRegisterRequest request) {
        GoogleUserInfo googleUserInfo = verifyIdToken(request.idToken());

        User user = userRepository.findByEmail(googleUserInfo.email());
        if (user != null) {
            if (user.getStatus() == null ||
                    !user.getStatus().equals(UserStatus.ACTIVE.toString()) ||
                    user.getDeletedAt() != null)
                throw new BadRequestException(ErrorCode.USER_INACTIVE);

            throw new BadRequestException(ErrorCode.USER_EXISTED);
        }

        String password = generatePassword();
        Role role = roleRepository.findByName(RoleEnum.CITIZEN.name())
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_DATA));
        User newUser = User.builder()
                .fullName(googleUserInfo.fullName())
                .email(googleUserInfo.email())
                .passwordHash(passwordEncoder.encode(password))
                .imageUrl(googleUserInfo.pictureUrl())
                .role(role)
                .status(UserStatus.ACTIVE.toString())
                .build();
        userRepository.save(newUser);

        log.info("Register user by Google successfully: {}", newUser.getEmail());

        return new GoogleRegisterResponse(newUser.getEmail(), newUser.getFullName(), password);
    }

    @Override
    public GoogleUserInfo verifyIdToken(String idToken) {
        GoogleIdToken googleIdToken;
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory()
            ).setAudience(Collections.singletonList(googleClientId))
                    .build();

            googleIdToken = verifier.verify(idToken);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

        if (googleIdToken == null)
            throw new AuthenticationException(ErrorCode.GOOGLE_ID_TOKEN_INVALID);
        log.info("Verify Google id token successfully");

        GoogleIdToken.Payload payload = googleIdToken.getPayload();

        return new GoogleUserInfo(
                payload.getEmail(),
                (String) payload.get("name"),
                (String) payload.get("picture"),
                payload.getEmailVerified()
        );
    }

    String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                    "abcdefghijklmnopqrstuvwxyz" +
                    "0123456789" +
                    "!@#$%^&*()-_=+[]{}|;:,.<>?";
    int length = 10;

    private String generatePassword() {
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = secureRandom.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }
        return sb.toString();
    }
}
