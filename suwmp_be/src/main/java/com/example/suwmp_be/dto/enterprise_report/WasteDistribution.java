package com.example.suwmp_be.dto.enterprise_report;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WasteDistribution {
    private String wasteType;
    private Long totalReports;
    private Double percentage;
}
