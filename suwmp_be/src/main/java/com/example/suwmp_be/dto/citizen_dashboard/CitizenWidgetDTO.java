package com.example.suwmp_be.dto.citizen_dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CitizenWidgetDTO {
    private Long totalReports;
    private Long rewardPoints;
    private Double totalVolume;
    private Long itemsRecycled;
}
