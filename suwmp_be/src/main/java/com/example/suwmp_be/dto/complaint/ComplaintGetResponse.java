package com.example.suwmp_be.dto.complaint;

import com.example.suwmp_be.constants.ComplaintStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ComplaintGetResponse(
    long id,
    UUID citizenId,
    String citizenName,
    long wasteReportId,
    String description,
    String photoUrl,
    ComplaintStatus status,
    LocalDateTime createdAt
) { }
