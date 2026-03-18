package com.example.suwmp_be.dto.request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateWasteReportStatusRequest {

    @NotNull(message = "Waste report ID cannot be null")
    private long wasteReportId;

    @Pattern(
            regexp = "^(PENDING|REJECTED|ASSIGNED|ON_THE_WAY|COLLECTED)$",
            message = "Status must be one of: PENDING, REJECTED, ASSIGNED, ON_THE_WAY, COLLECTED"
    )
    private String status;
}
