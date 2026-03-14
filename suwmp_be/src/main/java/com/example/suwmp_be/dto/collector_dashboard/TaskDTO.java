package com.example.suwmp_be.dto.collector_dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TaskDTO {
    private Long taskId;
    private String wasteType;
    private String status;
    private boolean isPriority;
    private double distanceKm;
    private int estimatedMins;
    private String citizenName;
}
