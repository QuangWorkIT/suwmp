package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.enterprise_report.CollectionTrendDTO;
import com.example.suwmp_be.dto.enterprise_report.CollectorPerformance;
import com.example.suwmp_be.dto.enterprise_report.EnterpriseWidgetDTO;
import com.example.suwmp_be.dto.enterprise_report.WasteDistribution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEnterpriseReportService {
    EnterpriseWidgetDTO getEnterpriseWidgetData();
    List<WasteDistribution> getWasteDistribution();
    List<CollectionTrendDTO> getCollectionTrends();
    Page<CollectorPerformance> getCollectorPerformance(Pageable pageable);
}
