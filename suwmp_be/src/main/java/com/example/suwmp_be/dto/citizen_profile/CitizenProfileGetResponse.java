package com.example.suwmp_be.dto.citizen_profile;

import java.util.UUID;

public record CitizenProfileGetResponse(
        UUID citizenId,
        String fullName,
        String phoneNumber,
        String email,
        int points,
        int reports,
        double volume,
        int feedbacks
) { }
