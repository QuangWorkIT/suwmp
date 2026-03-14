package com.example.suwmp_be.dto.enterprise_report;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CollectorPerformance {
    private String collectorName;
    private String zone;
    private Long collections;
    private Double efficiency;
    private Double rating;
}
