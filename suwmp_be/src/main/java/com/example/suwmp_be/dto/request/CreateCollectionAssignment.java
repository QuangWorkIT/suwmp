package com.example.suwmp_be.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class CreateCollectionAssignment {

    @Positive(message = "Waste report must be a positive value")
    private Long wasteReportId;

    @Positive(message = "Waste report must be a positive value")
    private Long enterpriseId;

    private UUID collectorId;
    private LocalDateTime assignedAt;
    private LocalDateTime startCollectAt;
}
