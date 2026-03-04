package com.example.suwmp_be.dto.email;

public record SendLinkResetDto(
        String to,
        String fullName,
        String resetToken
) { }
