package com.example.suwmp_be.dto.complaint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateComplaintRequest {
    @NotNull(message = "Waste report ID is required")
    private Long wasteReportId;
    @NotBlank(message = "Description is required")
    private String description;
    private String photoUrl;
}
