package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.forgot_password.ResetPasswordRequest;
import com.example.suwmp_be.dto.forgot_password.VerifyEmailRequest;
import com.example.suwmp_be.dto.google_auth.GoogleLoginRequest;
import com.example.suwmp_be.dto.google_auth.TokenGoogleResponse;
import com.example.suwmp_be.dto.request.LoginRequest;
import com.example.suwmp_be.dto.request.RegisterRequest;
import com.example.suwmp_be.dto.response.TokenResponse;
import com.example.suwmp_be.entity.Token;
import com.example.suwmp_be.entity.User;

import java.util.UUID;

public interface IAuthService {
    UUID register(RegisterRequest req);
    TokenResponse login(LoginRequest req);

    //refresh token
    TokenResponse refreshToken(String refreshToken);
    Token generateRefreshToken(User user);
    void deleteRefreshToken(String tokenId);

    void verifyEmail(VerifyEmailRequest email);

    void resetPassword(ResetPasswordRequest request);
}
