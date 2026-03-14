package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.enterprise_report.CollectionTrendDTO;
import com.example.suwmp_be.dto.enterprise_report.CollectorPerformance;
import com.example.suwmp_be.dto.enterprise_report.EnterpriseWidgetDTO;
import com.example.suwmp_be.dto.enterprise_report.WasteDistribution;
import com.example.suwmp_be.repository.EnterpriseReportRepository;
import com.example.suwmp_be.service.IEnterpriseReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class EnterpriseReportService implements IEnterpriseReportService {

    private final EnterpriseReportRepository reportRepository;

    @Override
    public EnterpriseWidgetDTO getEnterpriseWidgetData() {
        Long totalCollections = reportRepository.getTotalCollections();
        Double volumeProcessed = reportRepository.getTotalVolumeTons();
        Double averageResponseTime = reportRepository.getAverageResponseTime();
        Double citizenSatisfactionScore = reportRepository.getCitizenSatisfaction();

        if (totalCollections == null) totalCollections = 0L;
        if (volumeProcessed == null) volumeProcessed = 0.0;
        if (averageResponseTime == null) averageResponseTime = 0.0;
        if (citizenSatisfactionScore == null) citizenSatisfactionScore = 0.0;

        EnterpriseWidgetDTO widgetDTO = new EnterpriseWidgetDTO();
        widgetDTO.setTotalCollections(totalCollections);
        widgetDTO.setVolumeProcessed(volumeProcessed);
        widgetDTO.setAverageResponseTime(averageResponseTime);
        widgetDTO.setCitizenSatisfactionScore(citizenSatisfactionScore);

        return widgetDTO;
    }

    @Override
    public List<WasteDistribution> getWasteDistribution() {

        List<WasteDistribution> results = reportRepository.getWasteDistribution();
        Long total = reportRepository.getTotalWasteReports();

        if (total == null || total == 0) return results;

        results.forEach(r -> {
            double percentage = (r.getTotalReports() * 100.0) / total;
            r.setPercentage(percentage);
        });

        return results;
    }

    @Override
    public List<CollectionTrendDTO> getCollectionTrends() {
        List<Object[]> results = reportRepository.getCollectionTrends();

        return results.stream()
                .map(row -> new CollectionTrendDTO(
                        (String) row[0],
                        ((Number) row[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Page<CollectorPerformance> getCollectorPerformance(Pageable pageable) {
        Page<Object[]> rawPage = reportRepository.getCollectorPerformance(pageable);

        // Target SLA in hours to calculate percentage efficiency (e.g., 24 hours)
        final double TARGET_SLA_HOURS = 24.0;

        // 2. Use Page.map() directly instead of stream().collect()
        return rawPage.map(row -> {
            double avgHoursTaken = row[3] != null ? ((Number) row[3]).doubleValue() : 0.0;

            // Convert hours to an efficiency percentage (Capped between 0 and 100)
            double rawEfficiency = ((TARGET_SLA_HOURS - avgHoursTaken) / TARGET_SLA_HOURS) * 100.0;
            double efficiencyPercent = Math.max(0.0, Math.min(100.0, rawEfficiency));

            return new CollectorPerformance(
                    (String) row[0],                                       // collectorName
                    "Zone " + (row[1] != null ? row[1].toString() : "N/A"), // zone (handled null gracefully)
                    ((Number) row[2]).longValue(),                         // collections
                    Math.round(efficiencyPercent * 10.0) / 10.0,           // efficiency (%)
                    row[4] != null ? ((Number) row[4]).doubleValue() : 0.0 // rating
            );
        });
    }
}
