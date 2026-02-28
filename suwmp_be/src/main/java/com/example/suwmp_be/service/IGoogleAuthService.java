package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.google_auth.GoogleLoginRequest;
import com.example.suwmp_be.dto.google_auth.GoogleLoginResponse;
import com.example.suwmp_be.dto.google_auth.GoogleUserInfo;
import com.example.suwmp_be.dto.google_auth.TokenGoogleResponse;

public interface IGoogleAuthService {
    GoogleUserInfo verifyIdToken(GoogleLoginRequest request);

    GoogleLoginResponse loginByGoogle(GoogleLoginRequest request);
}
