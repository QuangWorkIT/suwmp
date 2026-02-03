package com.example.suwmp_be.controller;


import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.EnterpriseNearbyResponse;
import com.example.suwmp_be.dto.view.ICollectionRequestView;
import com.example.suwmp_be.service.IWasteReportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/waste-reports")
public class WasteReportController {
    private final IWasteReportService wasteService;

    @PostMapping
    public ResponseEntity<BaseResponse<Long>> createWasteReport(
            @Valid @RequestBody WasteReportRequest request
    ) {
        return ResponseEntity.status(201)
                .body(new BaseResponse<>(
                        true,
                        "created report",
                        wasteService.createNewReport(request))
                );
    }

    @GetMapping("/enterprises/{enterpriseId}")
    public ResponseEntity<BaseResponse<List<ICollectionRequestView>>> getWasteReports(
            @PathVariable @Positive Long enterpriseId
    ) {
        return ResponseEntity.ok(new BaseResponse<>(
                true, "Get waste reports successfully",
                wasteService.getWasteReportRequestsByEnterprise(enterpriseId)
        ));
    }

    @GetMapping("/enterprises/nearby/citizens")
    public ResponseEntity<BaseResponse<List<EnterpriseNearbyResponse>>> getNearByEnterprises(
            @Positive @Param("longitude") double longitude,
            @Positive @Param("latitude") double latitude,
            @Positive @Param("wasteTypeId") long wasteTypeId
    ) {
        return ResponseEntity.ok(new BaseResponse<>(
                true, "Get nearby enterprises success",
                wasteService.getEnterprisesNearbyCitizen(
                        longitude,
                        latitude,
                        wasteTypeId)
        ));
    }
}
