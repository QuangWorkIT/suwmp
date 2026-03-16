package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.enterprise_capacity.GetEnterpriseUserByUserIdResponse;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.EnterpriseUser;

import java.util.Optional;
import java.util.UUID;

public interface IEnterpriseUserService {
    GetEnterpriseUserByUserIdResponse getEnterpriseUserByUserIdResponse(UUID userId);

    Enterprise getEnterpriseByUserId(UUID userId);
}
