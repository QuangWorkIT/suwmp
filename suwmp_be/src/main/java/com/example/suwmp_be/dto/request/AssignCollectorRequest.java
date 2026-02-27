package com.example.suwmp_be.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AssignCollectorRequest {

    @NotNull(message = "Waste report IDs are required")
    @Size(min = 1, message = "At least one waste report ID is required")
    private List<@Positive(message = "Waste report ID must be a positive value") Long> wasteReportIds;

    @NotNull(message = "Enterprise ID is required")
    @Positive(message = "Enterprise ID must be a positive value")
    private Long enterpriseId;

    @NotNull(message = "Collector ID is required")
    private UUID collectorId;

    @NotNull(message = "Start collect time is required")
    @FutureOrPresent(message = "Start collect time must be in the present or future")
    private OffsetDateTime startCollectAt;
}
