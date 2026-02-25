package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.enterprise_capacity.GetEnterpriseUserByUserIdResponse;

import java.util.UUID;

public interface IEnterpriseUserService {
    GetEnterpriseUserByUserIdResponse getEnterpriseUserByUserIdResponse(UUID userId);
}
