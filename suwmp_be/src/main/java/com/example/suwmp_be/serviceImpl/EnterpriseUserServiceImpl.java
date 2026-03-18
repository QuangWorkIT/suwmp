package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.enterprise_capacity.GetEnterpriseUserByUserIdResponse;
import com.example.suwmp_be.dto.mapper.IEnterpriseUserMapper;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.EnterpriseUser;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.EnterpriseRepository;
import com.example.suwmp_be.repository.EnterpriseUserRepository;
import com.example.suwmp_be.service.IEnterpriseUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EnterpriseUserServiceImpl implements IEnterpriseUserService {
    EnterpriseUserRepository enterpriseUserRepository;
    IEnterpriseUserMapper enterpriseUserMapper;
    EnterpriseRepository enterpriseRepository;

    @Override
    public GetEnterpriseUserByUserIdResponse getEnterpriseUserByUserIdResponse(UUID userId) {
        var enterpriseUser = enterpriseUserRepository.findByUserId(userId)
                .orElse(null);
        log.info("Get successfully enterprise user by user id: {}", userId);
        return enterpriseUserMapper.toGetEnterpriseUserByUserIdResponse(enterpriseUser);
    }

    @Override
    public Enterprise getEnterpriseByUserId(UUID userId) {
        EnterpriseUser enterpriseUser = enterpriseUserRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ENTERPRISE_USER_NOT_FOUND));

        return enterpriseRepository.findById(enterpriseUser.getEnterpriseId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ENTERPRISE_NOT_FOUND));
    }
}
