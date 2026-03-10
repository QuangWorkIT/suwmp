package com.example.suwmp_be.dto.citizen_dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyProgressDTO {
    private Double currentPlasticKg;
    private Double targetPlasticKg;

    private Long currentReports;
    private Long targetReports;

    private Long currentPoints;
    private Long targetPoints;
}
