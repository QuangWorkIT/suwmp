package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.constants.WasteReportStatus;
import com.example.suwmp_be.dto.request.AssignCollectorRequest;
import com.example.suwmp_be.entity.CollectionAssignment;
import com.example.suwmp_be.entity.EnterpriseCollector;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.exception.BadRequestException;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.CollectionAssignmentRepository;
import com.example.suwmp_be.repository.EnterpriseCollectorRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.ICollectionAssignmentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CollectionAssignmentServiceImpl implements ICollectionAssignmentService {
    private final CollectionAssignmentRepository collectionAssignmentRepository;
    private final WasteReportRepository wasteReportRepository;
    private final EnterpriseCollectorRepository enterpriseCollectorRepository;

    @Override
    @Transactional
    public Long assignCollector(AssignCollectorRequest dto) {
        // Validates enterprise exists, collector exists, and collector
        // belongs to the enterprise
        EnterpriseCollector enterpriseCollector = enterpriseCollectorRepository
                .findByEnterpriseIdAndCollectorId(dto.getEnterpriseId(), dto.getCollectorId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.COLLECTOR_NOT_IN_ENTERPRISE));

        Enterprise enterprise = enterpriseCollector.getEnterprise();
        User collector = enterpriseCollector.getCollector();

        if(collector.getStatus().equals("INACTIVE")) {
            throw new BadRequestException(ErrorCode.COLLECTOR_NOT_AVAILABLE);
        }

        // Deduplicate waste report IDs
        List<Long> uniqueIds = new ArrayList<>(new LinkedHashSet<>(dto.getWasteReportIds()));

        // Batch-fetch existing assignments and waste reports (eliminates N+1)
        Map<Long, CollectionAssignment> existingAssignmentMap = collectionAssignmentRepository
                .findByWasteReportIdIn(uniqueIds).stream()
                .collect(Collectors.toMap(ca -> ca.getWasteReport().getId(), ca -> ca));

        Map<Long, WasteReport> wasteReportMap = wasteReportRepository
                .findAllById(uniqueIds).stream()
                .collect(Collectors.toMap(WasteReport::getId, wr -> wr));

        List<CollectionAssignment> assignments = new ArrayList<>();

        for (Long wasteReportId : uniqueIds) {
            // Validate waste report exists
            WasteReport wasteReport = wasteReportMap.get(wasteReportId);
            if (wasteReport == null) {
                throw new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND);
            }

            // Update status to ASSIGNED
            wasteReport.setStatus(WasteReportStatus.ASSIGNED);

            // Update existing assignment or create new one
            CollectionAssignment existing = existingAssignmentMap.get(wasteReportId);
            if (existing != null) {
                existing.setStartCollectAt(dto.getStartCollectAt());
                existing.setCollector(collector);
                assignments.add(existing);
            } else {
                CollectionAssignment ca = new CollectionAssignment();
                ca.setCollector(collector);
                ca.setEnterprise(enterprise);
                ca.setStartCollectAt(dto.getStartCollectAt());
                ca.setWasteReport(wasteReport);
                assignments.add(ca);
            }
        }

        return (long) collectionAssignmentRepository.saveAll(assignments).size();
    }
}
