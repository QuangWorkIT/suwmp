package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.mapper.ICollectionAssignmentMapper;
import com.example.suwmp_be.dto.request.CreateCollectionAssignment;
import com.example.suwmp_be.entity.CollectionAssignment;
import com.example.suwmp_be.repository.CollectionAssignmentRepository;
import com.example.suwmp_be.repository.EnterpriseRepository;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.ICollectionAssignmentService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CollectionAssignmentServiceImpl implements ICollectionAssignmentService {
    private final CollectionAssignmentRepository collectionAssignmentRepository;
    private final ICollectionAssignmentMapper mapper;
    private final WasteReportRepository wasteReportRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Long createACollectionAssignment(CreateCollectionAssignment dto) {
        CollectionAssignment ca = mapper.toEntity(dto);

        ca.setWasteReport(
                wasteReportRepository.getReferenceById(dto.getWasteReportId())
        );

        ca.setEnterprise(
                enterpriseRepository.getReferenceById(dto.getEnterpriseId())
        );

        if (ca.getCollector() != null) {
            ca.setCollector(
                    userRepository.getReferenceById(dto.getCollectorId())
            );
        }
        return collectionAssignmentRepository.save(ca).getId();
    }
}
