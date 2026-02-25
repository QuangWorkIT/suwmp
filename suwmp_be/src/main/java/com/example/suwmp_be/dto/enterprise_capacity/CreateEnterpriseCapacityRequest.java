package com.example.suwmp_be.dto.enterprise_capacity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateEnterpriseCapacityRequest(
        @Positive
        @NotNull
        Long enterpriseId,

        @Positive
        @NotNull
        Long wasteTypeId,

        @Positive
        int dailyCapacityKg,

        @Positive
        @Max(value = 100)
        int warningThreshold,

        @JsonIgnore
        Boolean active
) {
    public CreateEnterpriseCapacityRequest {
        if (active == null) active = true;
    }
}
