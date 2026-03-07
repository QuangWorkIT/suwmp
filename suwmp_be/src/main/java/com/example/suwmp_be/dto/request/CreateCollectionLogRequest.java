package com.example.suwmp_be.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class CreateCollectionLogRequest {
    @NotNull(message = "Waste report ID cannot be null")
    private long wasteReportId;

    @NotNull(message = "Collection assignment ID cannot be null")
    private long collectionAssignmentId;

    @NotNull(message = "Photo URL cannot be null")
    private String photoUrl;

    @NotNull(message = "Collector ID cannot be null")
    private String collectorId;
}
