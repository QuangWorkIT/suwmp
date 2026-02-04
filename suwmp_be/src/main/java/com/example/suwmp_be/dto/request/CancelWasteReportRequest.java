package com.example.suwmp_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CancelWasteReportRequest {

    @NotNull(message = "Waste report id is required")
    @Positive(message = "Waste report id requires a positive value")
    private final Long wasteReportId;

    @NotBlank(message = "Enterprise note is required")
    @Size(max = 500)
    private final String note;
}
