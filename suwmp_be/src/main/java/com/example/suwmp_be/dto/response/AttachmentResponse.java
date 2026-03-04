package com.example.suwmp_be.dto.response;

import java.time.LocalDateTime;

public record AttachmentResponse(
        Long id,
        String url,
        String fileName,
        LocalDateTime uploadedAt
) {
}
