package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.exception.AuthenticationException;
import com.example.suwmp_be.service.IOtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OtpService implements IOtpService {
    private final RedisTemplate<String, Object> redis;

    // Default 15 minutes for dev if not provided via env.
    @Value("${OTP_TTL_MILIS:900000}")
    private long otpTtlMs;

    @Override
    public String generateResetToken(String email) {
        String resetToken = UUID.randomUUID().toString();
        redis.opsForValue().set(buildKeyReset(resetToken), email, Duration.ofMillis(otpTtlMs));
        return resetToken;
    }

    @Override
    public String validateToken(String resetToken) {
        Object email = redis.opsForValue().get(buildKeyReset(resetToken));
        if (email == null)
            throw new AuthenticationException(ErrorCode.RESET_TOKEN_INVALID);

        // delete reset token when reset password endpoint executes
        redis.delete(buildKeyReset(resetToken));

        return email.toString();
    }

    private String buildKeyReset(String resetToken) {
        return "reset-token:" + resetToken;
    }
}
