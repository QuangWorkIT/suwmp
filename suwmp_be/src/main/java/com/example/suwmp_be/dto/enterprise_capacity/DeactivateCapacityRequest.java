package com.example.suwmp_be.dto.enterprise_capacity;

import jakarta.validation.constraints.Positive;

public record DeactivateCapacityRequest(
        @Positive
        long id) {
}
