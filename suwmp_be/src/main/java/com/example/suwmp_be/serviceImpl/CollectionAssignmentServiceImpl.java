package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.request.AssignCollectorRequest;
import com.example.suwmp_be.entity.CollectionAssignment;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.exception.BadRequestException;
import com.example.suwmp_be.exception.ResourceNotFoundException;
import com.example.suwmp_be.repository.CollectionAssignmentRepository;
import com.example.suwmp_be.repository.EnterpriseRepository;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.ICollectionAssignmentService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class CollectionAssignmentServiceImpl implements ICollectionAssignmentService {
    private final CollectionAssignmentRepository collectionAssignmentRepository;
    private final WasteReportRepository wasteReportRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Long assignCollector(AssignCollectorRequest dto) {
        List<CollectionAssignment> assignments = new ArrayList<>();

        // validate enterprise and collector existence
        Enterprise enterprise = enterpriseRepository.findById(dto.getEnterpriseId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.ENTERPRISE_NOT_FOUND));

        User collector = userRepository.findById(dto.getCollectorId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.COLLECTOR_NOT_FOUND));

        // create an assignment for each waste report
        for (Long wasteReportId : dto.getWasteReportId()) {

            // check if the waste report already has an assignment
            // then update the collector and start collect time
            CollectionAssignment existingAssignment = collectionAssignmentRepository
                    .findByWasteReportId(wasteReportId);
            if (existingAssignment != null) {
                existingAssignment.setStartCollectAt(dto.getStartCollectAt());
                existingAssignment.setCollector(collector);
                assignments.add(existingAssignment);
                continue;
            }

            CollectionAssignment ca = new CollectionAssignment();
            ca.setCollector(collector);
            ca.setEnterprise(enterprise);
            ca.setStartCollectAt(dto.getStartCollectAt());

            wasteReportRepository.findById(wasteReportId)
                    .ifPresentOrElse(ca::setWasteReport, () -> {
                        throw new ResourceNotFoundException("WasteReport", "id", wasteReportId);
                    });
            assignments.add(ca);
        }

        return (long) collectionAssignmentRepository.saveAll(assignments).size();
    }
}
