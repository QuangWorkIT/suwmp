package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.CreateServiceAreaRequest;
import com.example.suwmp_be.dto.response.ServiceAreaResponse;

import java.util.List;

public interface ServiceAreaService {
    ServiceAreaResponse create(Long enterpriseId, CreateServiceAreaRequest request);
    List<ServiceAreaResponse> list(Long enterpriseId);
}

