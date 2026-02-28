package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.google_auth.GoogleLoginRequest;
import com.example.suwmp_be.dto.google_auth.GoogleUserInfo;
import com.example.suwmp_be.dto.google_auth.TokenGoogleResponse;

public interface IGoogleAuthService {
    GoogleUserInfo verifyIdToken(GoogleLoginRequest request);

    TokenGoogleResponse loginByGoogle(GoogleLoginRequest request);
}
