package com.example.suwmp_be.dto.complaint;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateComplaintRequest {
    private Long wasteReportId;
    private String description;
    private String photoUrl;
}
