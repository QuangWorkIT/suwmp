package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.RoleEnum;
import com.example.suwmp_be.dto.request.CreateCollectorRequest;
import com.example.suwmp_be.dto.request.UpdateCollectorRequest;
import com.example.suwmp_be.dto.response.CollectorResponse;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.EnterpriseCollector;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.repository.EnterpriseCollectorRepository;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.service.ICollectorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CollectorServiceImpl implements ICollectorService {

    private final EnterpriseCollectorRepository enterpriseCollectorRepository;
    private final UserRepository userRepository;
    private final RoleCacheService roleCacheService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public Page<CollectorResponse> getCollectorsByEnterprise(Long enterpriseId, Pageable pageable) {
        log.debug("Fetching collectors for enterpriseId: {}", enterpriseId);
        return enterpriseCollectorRepository.findByEnterpriseId(enterpriseId, pageable)
                .map(this::toCollectorResponse);
    }

    @Override
    public CollectorResponse createCollector(Long enterpriseId, CreateCollectorRequest request) {
        log.info("Creating collector for enterpriseId: {}", enterpriseId);

        // Check if email or phone already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already exists");
        }

        // Create new User with COLLECTOR role
        User collector = new User();
        collector.setFullName(request.getFullName());
        collector.setEmail(request.getEmail());
        collector.setPhone(request.getPhone());
        collector.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        collector.setRole(roleCacheService.get(RoleEnum.COLLECTOR));
        collector.setStatus("ACTIVE");
        User savedCollector = userRepository.save(collector);

        // Create EnterpriseCollector record
        // Note: Enterprise entity stub exists for compilation, full implementation handled by another person
        Enterprise enterprise = new Enterprise();
        enterprise.setId(enterpriseId);
        
        EnterpriseCollector enterpriseCollector = EnterpriseCollector.builder()
                .enterprise(enterprise)
                .collector(savedCollector)
                .status("ACTIVE")
                .build();

        enterpriseCollectorRepository.save(enterpriseCollector);

        log.info("Successfully created collector with id: {} for enterpriseId: {}", savedCollector.getId(), enterpriseId);
        return toCollectorResponse(enterpriseCollector);
    }

    @Override
    public CollectorResponse updateCollector(Long enterpriseId, UUID collectorId, UpdateCollectorRequest request) {
        log.info("Updating collector with id: {} for enterpriseId: {}", collectorId, enterpriseId);

        EnterpriseCollector enterpriseCollector = enterpriseCollectorRepository
                .findByEnterpriseIdAndCollectorId(enterpriseId, collectorId)
                .orElseThrow(() -> new RuntimeException("Collector not found for enterpriseId: " + enterpriseId + " and collectorId: " + collectorId));

        User collector = enterpriseCollector.getCollector();

        // Update fields if provided
        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            collector.setFullName(request.getFullName());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            // Check if email is already taken by another user
            User existingUser = userRepository.findByEmail(request.getEmail());
            if (existingUser != null && !existingUser.getId().equals(collectorId)) {
                throw new RuntimeException("Email already exists");
            }
            collector.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            // Check if phone is already taken by another user
            if (userRepository.existsByPhone(request.getPhone()) && 
                !userRepository.findById(collectorId).orElseThrow().getPhone().equals(request.getPhone())) {
                throw new RuntimeException("Phone already exists");
            }
            collector.setPhone(request.getPhone());
        }
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            enterpriseCollector.setStatus(request.getStatus());
        }

        userRepository.save(collector);
        enterpriseCollectorRepository.save(enterpriseCollector);

        log.info("Successfully updated collector with id: {} for enterpriseId: {}", collectorId, enterpriseId);
        return toCollectorResponse(enterpriseCollector);
    }

    @Override
    public void deleteCollector(Long enterpriseId, UUID collectorId) {
        log.info("Deleting collector with id: {} for enterpriseId: {}", collectorId, enterpriseId);

        EnterpriseCollector enterpriseCollector = enterpriseCollectorRepository
                .findByEnterpriseIdAndCollectorId(enterpriseId, collectorId)
                .orElseThrow(() -> new RuntimeException("Collector not found for enterpriseId: " + enterpriseId + " and collectorId: " + collectorId));

        // Soft delete: set status to INACTIVE
        enterpriseCollector.setStatus("INACTIVE");
        enterpriseCollectorRepository.save(enterpriseCollector);

        log.info("Successfully deleted (soft delete) collector with id: {} for enterpriseId: {}", collectorId, enterpriseId);
    }

    private CollectorResponse toCollectorResponse(EnterpriseCollector enterpriseCollector) {
        User collector = enterpriseCollector.getCollector();
        return CollectorResponse.builder()
                .id(collector.getId())
                .fullName(collector.getFullName())
                .email(collector.getEmail())
                .phone(collector.getPhone())
                .status(enterpriseCollector.getStatus())
                .imageUrl(collector.getImageUrl())
                .createdAt(collector.getCreatedAt())
                .build();
    }
}

