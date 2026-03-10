package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.enterprise_report.CollectionTrendDTO;
import com.example.suwmp_be.dto.enterprise_report.CollectorPerformance;
import com.example.suwmp_be.dto.enterprise_report.EnterpriseWidgetDTO;
import com.example.suwmp_be.dto.enterprise_report.WasteDistribution;

import java.util.List;

public interface IEnterpriseReportService {
    EnterpriseWidgetDTO getEnterpriseWidgetData();
    List<WasteDistribution> getWasteDistribution();
    List<CollectionTrendDTO> getCollectionTrends();
    List<CollectorPerformance> getCollectorPerformance();
}
