package com.example.suwmp_be.dto.enterprise_capacity;

import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateEnterpriseCapacityRequest {
    @Positive
    int dailyCapacityKg;

    @Positive
    int warningThreshold;

    boolean active;
}
