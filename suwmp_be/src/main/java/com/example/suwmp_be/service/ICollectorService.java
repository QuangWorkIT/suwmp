package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.CreateCollectorRequest;
import com.example.suwmp_be.dto.request.UpdateCollectorRequest;
import com.example.suwmp_be.dto.response.CollectorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ICollectorService {
    Page<CollectorResponse> getCollectorsByEnterprise(Long enterpriseId, Pageable pageable);
    
    CollectorResponse createCollector(Long enterpriseId, CreateCollectorRequest request);
    
    CollectorResponse updateCollector(Long enterpriseId, UUID collectorId, UpdateCollectorRequest request);
    
    void deleteCollector(Long enterpriseId, UUID collectorId);
}

