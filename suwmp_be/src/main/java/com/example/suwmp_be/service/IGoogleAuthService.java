package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.google_auth.*;

public interface IGoogleAuthService {
    GoogleUserInfo verifyIdToken(String idToken);

    GoogleLoginResponse loginByGoogle(GoogleLoginRequest request);

    GoogleRegisterResponse registerByGoogle(GoogleRegisterRequest request);
}
