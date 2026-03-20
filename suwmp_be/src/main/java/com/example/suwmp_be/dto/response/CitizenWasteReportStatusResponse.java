package com.example.suwmp_be.dto.response;

import java.time.LocalDateTime;

public record CitizenWasteReportStatusResponse(
        Long id,
        String referenceCode,
        String status,
        LocalDateTime createdAt,
        String wasteTypeName,
        String enterpriseName,
        String collectorName,
        double latitude,
        double longitude,
        Double volume,
        String photoUrl,
        String description,
        int rewardPoints
) {
}

