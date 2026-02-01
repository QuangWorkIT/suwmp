package com.example.suwmp_be.dto.enterprise_capacity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Positive;

public record CreateEnterpriseCapacityRequest(
        @Positive
        long enterpriseId,

        @Positive
        long wasteTypeId,

        @Positive
        int dailyCapacityKg,

        @Positive
        int warningThreshold,

        @JsonIgnore
        Boolean active
) {
    public CreateEnterpriseCapacityRequest {
        if (active == null) active = true;
    }
}
