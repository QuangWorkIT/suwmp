package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.enterprise_report.CollectionTrendDTO;
import com.example.suwmp_be.dto.enterprise_report.EnterpriseWidgetDTO;
import com.example.suwmp_be.service.IEnterpriseReportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ENTERPRISE')")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EnterpriseReportController {

    IEnterpriseReportService enterpriseReportService;

    @GetMapping("/report-widget")
    public ResponseEntity<BaseResponse<EnterpriseWidgetDTO>> getEnterpriseWidgetData() {
        var widgetData = enterpriseReportService.getEnterpriseWidgetData();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Get enterprise widget data successful",
                widgetData)
        );
    }

    @GetMapping("/waste-distribution")
    public ResponseEntity<BaseResponse<?>> getWasteDistribution() {
        var distributionData = enterpriseReportService.getWasteDistribution();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Get waste distribution data successful",
                distributionData)
        );
    }

    @GetMapping("/collection-trends")
    public ResponseEntity<BaseResponse<List<CollectionTrendDTO>>> getCollectionTrends() {
        var trendsData = enterpriseReportService.getCollectionTrends();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Get collection trends successful",
                trendsData)
        );
    }

    @GetMapping("/collector-performance")
    public ResponseEntity<BaseResponse<?>> getCollectorPerformance() {
        var performanceData = enterpriseReportService.getCollectorPerformance();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Get collector performance data successful",
                performanceData)
        );
    }
}
