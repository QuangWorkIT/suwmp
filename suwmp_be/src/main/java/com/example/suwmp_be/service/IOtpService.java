package com.example.suwmp_be.service;

public interface IOtpService {
    String generateResetToken(String email);
    String validateToken(String resetToken);
}
