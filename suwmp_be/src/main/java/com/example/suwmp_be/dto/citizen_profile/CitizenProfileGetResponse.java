package com.example.suwmp_be.dto.citizen_profile;

import java.time.Instant;
import java.util.UUID;

public record CitizenProfileGetResponse(
        UUID citizenId,
        String fullName,
        String phoneNumber,
        String email,
        Instant createdAt,
        int points,
        long reports,
        double volume,
        long feedbacks
) { }
