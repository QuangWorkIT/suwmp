package com.example.suwmp_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.UUID;

@Data
public class WasteReportRequest {

    @NotBlank
    private String photoUrl;

    @NotNull
    private Double longitude;

    @NotNull
    private Double latitude;

    private String description;

    @NotNull
    private Long enterprisesId;

    @NotNull
    private UUID citizenId;

    @NotNull
    private Integer wasteTypeId;

    @NotNull
    private Integer aiSuggestedTypeId;

    @NotNull
    @Pattern(regexp = "PENDING|ACCEPTED|ASSIGNED|COLLECTED")
    private String status;
}
