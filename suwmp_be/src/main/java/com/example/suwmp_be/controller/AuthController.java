package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.forgot_password.ResetPasswordRequest;
import com.example.suwmp_be.dto.forgot_password.VerifyEmailRequest;
import com.example.suwmp_be.dto.request.LoginRequest;
import com.example.suwmp_be.dto.request.RegisterRequest;
import com.example.suwmp_be.dto.response.TokenResponse;
import com.example.suwmp_be.serviceImpl.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
@Tag(name = "Authentication", description = "User authentication and authorization endpoints")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @Operation(
            summary = "Register a new user",
            description = "Register a new user account. By default, users are registered with CITIZEN role."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or email/phone already exists")
    })
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<BaseResponse<?>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Verify email successfully.")
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<BaseResponse<?>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Reset password successfully")
        );
    }

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description = "Authenticate user and receive access token and refresh token. " +
                    "Refresh token is set as HTTP-only cookie."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "202",
                    description = "Login successful",
                    content = @Content(schema = @Schema(implementation = TokenResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid credentials")
    })
    public ResponseEntity<BaseResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
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
    @Operation(
            summary = "User logout",
            description = "Logout user by invalidating the refresh token. " +
                    "The refresh token cookie will be cleared."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logout successful"),
            @ApiResponse(responseCode = "400", description = "Logout failed")
    })
    public ResponseEntity<BaseResponse<?>> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {
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
    @Operation(
            summary = "Refresh access token",
            description = "Generate a new access token using a valid refresh token. " +
                    "A new refresh token will also be issued and set as HTTP-only cookie."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Token refreshed successfully",
                    content = @Content(schema = @Schema(implementation = TokenResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid or expired refresh token")
    })
    public ResponseEntity<BaseResponse<TokenResponse>> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {
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
