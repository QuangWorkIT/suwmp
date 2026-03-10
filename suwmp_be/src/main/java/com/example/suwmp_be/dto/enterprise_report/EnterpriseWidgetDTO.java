package com.example.suwmp_be.dto.enterprise_report;

import lombok.Data;

@Data
public class EnterpriseWidgetDTO {
    private Long totalCollections;
    private double volumeProcessed;
    private double averageResponseTime;
    private double citizenSatisfactionScore;
}
