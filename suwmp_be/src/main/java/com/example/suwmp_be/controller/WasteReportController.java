package com.example.suwmp_be.controller;


import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.CitizenWasteReportStatusResponse;
import com.example.suwmp_be.dto.view.CollectionRequestView;
import com.example.suwmp_be.service.IWasteReportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/waste-report")
public class WasteReportController {
    private final IWasteReportService wasteService;

    @PreAuthorize("hasRole('CITIZEN')")
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

    @PreAuthorize("hasRole('ENTERPRISE')")
    @GetMapping("/enterprise/{enterpriseId}")
    public ResponseEntity<BaseResponse<List<CollectionRequestView>>> getWasteReports(
            @PathVariable @Positive Long enterpriseId
    ) {
        return ResponseEntity.ok(new BaseResponse<>(
                true, "Get waste reports successfully",
                wasteService.getWasteReportRequestsByEnterprise(enterpriseId)
        ));
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/{id}/status")
    public ResponseEntity<BaseResponse<CitizenWasteReportStatusResponse>> getCitizenReportStatus(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        UUID citizenId = (UUID) authentication.getPrincipal();
        CitizenWasteReportStatusResponse response =
                wasteService.getCitizenReportStatus(id, citizenId);

        return ResponseEntity.ok(
                new BaseResponse<>(
                        true,
                        "Get waste report status successfully",
                        response
                )
        );
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/citizen/me")
    public ResponseEntity<BaseResponse<List<CitizenWasteReportStatusResponse>>> getMyReports(
            Authentication authentication
    ) {
        UUID citizenId = (UUID) authentication.getPrincipal();
        List<CitizenWasteReportStatusResponse> reports =
                wasteService.getCitizenReports(citizenId);

        return ResponseEntity.ok(
                new BaseResponse<>(
                        true,
                        "Get citizen waste reports successfully",
                        reports
                )
        );
    }
}


