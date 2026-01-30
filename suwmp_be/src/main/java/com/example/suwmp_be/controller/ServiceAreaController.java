package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.CreateServiceAreaRequest;
import com.example.suwmp_be.dto.response.ServiceAreaResponse;
import com.example.suwmp_be.service.ServiceAreaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enterprises/{enterpriseId}/service-areas")
@RequiredArgsConstructor
public class ServiceAreaController {

    private final ServiceAreaService serviceAreaService;

    @PostMapping
    public ResponseEntity<BaseResponse<ServiceAreaResponse>> create(
            @PathVariable Long enterpriseId,
            @Valid @RequestBody CreateServiceAreaRequest request
    ) {
        ServiceAreaResponse created = serviceAreaService.create(enterpriseId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new BaseResponse<>(true, "Service area created successfully", created));
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<ServiceAreaResponse>>> list(
            @PathVariable Long enterpriseId
    ) {
        List<ServiceAreaResponse> areas = serviceAreaService.list(enterpriseId);
        return ResponseEntity.ok(new BaseResponse<>(true, "Service areas retrieved successfully", areas));
    }
}

