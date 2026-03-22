package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.enterprise_profile.EnterpriseGetResponse;
import com.example.suwmp_be.dto.enterprise_profile.EnterpriseUpdateProfileRequest;
import com.example.suwmp_be.dto.mapper.IEnterpriseMapper;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.EnterpriseUser;
import com.example.suwmp_be.exception.ForbiddenException;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.EnterpriseRepository;
import com.example.suwmp_be.repository.EnterpriseUserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class EnterpriseServiceImpl {
    final EnterpriseUserRepository enterpriseUserRepo;
    final EnterpriseRepository enterpriseRepo;
    final IEnterpriseMapper enterpriseMapper;

    public EnterpriseGetResponse getByEnterpriseUserId(UUID enterpriseUserId) {
        EnterpriseUser enterpriseUser = enterpriseUserRepo.findByUserId(enterpriseUserId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_ENTERPRISE_OWNER));

        Enterprise enterprise = enterpriseRepo.findById(enterpriseUser.getEnterpriseId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ENTERPRISE_NOT_FOUND));

        log.info("Get enterprise profile successful: {}", enterprise.getId());
        return enterpriseMapper.toEnterpriseGetResponse(enterprise);
    }

    public void updateEnterpriseProfile(long enterpriseId, UUID enterpriseUserId, EnterpriseUpdateProfileRequest request) {
        if (!enterpriseUserRepo.existsByEnterpriseIdAndUserId(enterpriseId, enterpriseUserId))
            throw new ForbiddenException(ErrorCode.USER_NOT_ENTERPRISE_OWNER);

        var enterprise = enterpriseRepo.findById(enterpriseId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ENTERPRISE_NOT_FOUND));

        enterpriseMapper.toEnterprise(enterprise, request);
        enterpriseRepo.save(enterprise);

        log.info("Update enterprise profile successful: {}", enterpriseId);
    }
}
