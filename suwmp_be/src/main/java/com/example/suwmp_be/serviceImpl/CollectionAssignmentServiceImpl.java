package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.constants.WasteReportStatus;
import com.example.suwmp_be.dto.request.AssignCollectorRequest;
import com.example.suwmp_be.entity.CollectionAssignment;
import com.example.suwmp_be.entity.EnterpriseCollector;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.exception.AuthenticationException;
import com.example.suwmp_be.exception.BadRequestException;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.CollectionAssignmentRepository;
import com.example.suwmp_be.repository.EnterpriseCollectorRepository;
import com.example.suwmp_be.repository.EnterpriseUserRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.ICollectionAssignmentService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final EnterpriseUserRepository enterpriseUserRepository;

    @Override
    @Transactional
    public Long assignCollector(AssignCollectorRequest dto) {
        UUID userId = getAuthenticatedUserId();
        validateEnterpriseAccess(dto.getEnterpriseId(), userId);

        EnterpriseCollector enterpriseCollector = findActiveCollector(dto.getEnterpriseId(), dto.getCollectorId());
        Enterprise enterprise = enterpriseCollector.getEnterprise();
        User collector = enterpriseCollector.getCollector();

        List<Long> uniqueWasteReportIds = deduplicateWasteReportIds(dto.getWasteReportIds());
        Map<Long, CollectionAssignment> existingAssignmentMap = findExistingAssignments(uniqueWasteReportIds);
        Map<Long, WasteReport> wasteReportMap = findWasteReports(uniqueWasteReportIds);

        List<CollectionAssignment> assignments = buildAssignments(
                uniqueWasteReportIds,
                wasteReportMap,
                existingAssignmentMap,
                collector,
                enterprise,
                dto
        );

        return (long) collectionAssignmentRepository.saveAll(assignments).size();
    }

    private UUID getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationException(ErrorCode.UNAUTHORIZED);
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UUID userId)) {
            throw new AuthenticationException(ErrorCode.UNAUTHORIZED);
        }
        return userId;
    }

    private void validateEnterpriseAccess(Long enterpriseId, UUID userId) {
        boolean isEnterpriseUser = enterpriseUserRepository.existsByEnterpriseIdAndUserId(enterpriseId, userId);
        if (!isEnterpriseUser) {
            throw new BadRequestException(ErrorCode.USER_NOT_ENTERPRISE_OWNER);
        }
    }

    private EnterpriseCollector findActiveCollector(Long enterpriseId, UUID collectorId) {
        EnterpriseCollector enterpriseCollector = enterpriseCollectorRepository
                .findByEnterpriseIdAndCollectorId(enterpriseId, collectorId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.COLLECTOR_NOT_IN_ENTERPRISE));

        if ("INACTIVE".equals(enterpriseCollector.getCollector().getStatus())) {
            throw new BadRequestException(ErrorCode.COLLECTOR_NOT_AVAILABLE);
        }

        return enterpriseCollector;
    }

    private List<Long> deduplicateWasteReportIds(List<Long> wasteReportIds) {
        return new ArrayList<>(new LinkedHashSet<>(wasteReportIds));
    }

    private Map<Long, CollectionAssignment> findExistingAssignments(List<Long> wasteReportIds) {
        return collectionAssignmentRepository.findByWasteReportIdIn(wasteReportIds).stream()
                .collect(Collectors.toMap(ca -> ca.getWasteReport().getId(), ca -> ca));
    }

    private Map<Long, WasteReport> findWasteReports(List<Long> wasteReportIds) {
        return wasteReportRepository.findAllById(wasteReportIds).stream()
                .collect(Collectors.toMap(WasteReport::getId, wr -> wr));
    }

    private List<CollectionAssignment> buildAssignments(
            List<Long> wasteReportIds,
            Map<Long, WasteReport> wasteReportMap,
            Map<Long, CollectionAssignment> existingAssignmentMap,
            User collector,
            Enterprise enterprise,
            AssignCollectorRequest dto
    ) {
        List<CollectionAssignment> assignments = new ArrayList<>();

        for (Long wasteReportId : wasteReportIds) {
            WasteReport wasteReport = wasteReportMap.get(wasteReportId);
            if (wasteReport == null) {
                throw new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND);
            }

            wasteReport.setStatus(WasteReportStatus.ASSIGNED);

            CollectionAssignment existing = existingAssignmentMap.get(wasteReportId);
            if (existing != null) {
                existing.setStartCollectAt(dto.getStartCollectAt());
                existing.setCollector(collector);
                assignments.add(existing);
                continue;
            }

            CollectionAssignment ca = new CollectionAssignment();
            ca.setCollector(collector);
            ca.setEnterprise(enterprise);
            ca.setStartCollectAt(dto.getStartCollectAt());
            ca.setWasteReport(wasteReport);
            assignments.add(ca);
        }

        return assignments;
    }
}
