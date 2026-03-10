package com.example.suwmp_be.dto.enterprise_capacity;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GetCapacitiesResponse {
    long id;
    long enterpriseId;
    int wasteTypeId;
    String wasteTypeName;
    int dailyCapacityKg;
    int warningThreshold;
    boolean active;
    double totalVolume;
}
