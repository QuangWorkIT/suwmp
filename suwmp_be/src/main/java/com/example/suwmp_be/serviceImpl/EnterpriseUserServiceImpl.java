package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.enterprise_capacity.GetEnterpriseUserByUserIdResponse;
import com.example.suwmp_be.dto.mapper.IEnterpriseUserMapper;
import com.example.suwmp_be.entity.EnterpriseUser;
import com.example.suwmp_be.exception.NotFoundException;
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

    @Override
    public GetEnterpriseUserByUserIdResponse getEnterpriseUserByUserIdResponse(UUID userId) {
        var enterpriseUser = enterpriseUserRepository.findByUserId(userId)
                .orElseGet(EnterpriseUser::new);
        log.info("Get successfully enterprise user by user id: {}", userId);
        return enterpriseUserMapper.toGetEnterpriseUserByUserIdResponse(enterpriseUser);
    }
}
