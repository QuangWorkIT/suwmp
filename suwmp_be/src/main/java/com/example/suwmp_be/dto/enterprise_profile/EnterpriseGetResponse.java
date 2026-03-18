package com.example.suwmp_be.dto.enterprise_profile;

import java.time.LocalDateTime;

public record EnterpriseGetResponse(
        long id,
        String name,
        String description,
        float rating,
        String photoUrl,
        LocalDateTime createdAt
) {
}
