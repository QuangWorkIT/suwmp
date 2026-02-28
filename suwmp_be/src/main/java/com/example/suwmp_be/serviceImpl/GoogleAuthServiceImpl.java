package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.constants.UserStatus;
import com.example.suwmp_be.dto.google_auth.GoogleLoginRequest;
import com.example.suwmp_be.dto.google_auth.GoogleLoginResponse;
import com.example.suwmp_be.dto.google_auth.GoogleUserInfo;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.exception.AuthenticationException;
import com.example.suwmp_be.exception.NotFoundException;
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
import org.springframework.stereotype.Service;

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

    @Override
    public GoogleLoginResponse loginByGoogle(GoogleLoginRequest request) {
        GoogleUserInfo googleUserInfo = verifyIdToken(request);

        User user = userRepository.findByEmail(googleUserInfo.email());
        if (user == null)
            throw new NotFoundException(ErrorCode.USER_NOT_FOUND);

        if (user.getStatus().equals(UserStatus.INACTIVE.toString()) ||
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
    public GoogleUserInfo verifyIdToken(GoogleLoginRequest request) {
        GoogleIdToken googleIdToken;
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory()
            ).setAudience(Collections.singletonList(googleClientId))
                    .build();

            googleIdToken = verifier.verify(request.idToken());
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
}
