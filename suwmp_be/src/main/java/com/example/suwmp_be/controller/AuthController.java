package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.LoginRequest;
import com.example.suwmp_be.dto.request.RegisterRequest;
import com.example.suwmp_be.dto.response.TokenResponse;
import com.example.suwmp_be.entity.Token;
import com.example.suwmp_be.serviceImpl.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request)
    {
        TokenResponse response = authService.login(request);
        ResponseCookie cookie = setCookieToken(response.getRefreshToken());
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .header("Set-cookie", cookie.toString())
                .body(new BaseResponse<>(
                true,
                "Login successful",
                response)
        );
    }

    @DeleteMapping("/logout")
    public ResponseEntity<BaseResponse<?>> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken)
    {
        try {
            if (refreshToken != null && !refreshToken.isEmpty()) {
                authService.deleteRefreshToken(refreshToken);
            }
            ResponseCookie response = ResponseCookie.from("refreshToken", "")
                    .maxAge(0)
                    .secure(true)
                    .httpOnly(true)
                    .path("/")
                    .sameSite("None")
                    .build();

            return ResponseEntity
                    .ok()
                    .header("Set-cookie", response.toString())
                    .body(new BaseResponse<>(
                            true,
                            "Logout successful",
                            null
                    ));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new BaseResponse<>(
                            false,
                            "Logout failed: " + e.getMessage(),
                            null
                    ));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<BaseResponse<TokenResponse>> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken)
    {
        TokenResponse token = authService.refreshToken(refreshToken);
        ResponseCookie cookie = setCookieToken(token.getRefreshToken());
        return ResponseEntity
                .ok()
                .header("Set-cookie", cookie.toString())
                .body(new BaseResponse<>(
                        true,
                        "Token refresh successfully",
                                token
                ));
    }

    private ResponseCookie setCookieToken(String refreshToken) {
        return ResponseCookie.from("refreshToken", refreshToken)
                .maxAge(7 * 24 * 60 * 60)
                .secure(true)
                .httpOnly(true)
                .path("/")
                .sameSite("None")
                .build();
    }
}
