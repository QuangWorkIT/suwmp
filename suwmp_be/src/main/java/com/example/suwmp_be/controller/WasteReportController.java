package com.example.suwmp_be.controller;


import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.WasteReportStatusResponse;
import com.example.suwmp_be.dto.view.CitizenReportView;
import com.example.suwmp_be.dto.view.CollectionRequestView;
import com.example.suwmp_be.service.IWasteReportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/waste-report")
@Validated
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

    @GetMapping("/enterprise/{enterpriseId}")
    public ResponseEntity<BaseResponse<List<CollectionRequestView>>> getWasteReports(
            @PathVariable @Positive Long enterpriseId
    ) {
        return ResponseEntity.ok(new BaseResponse<>(
                true, "Get waste reports successfully",
                wasteService.getWasteReportRequestsByEnterprise(enterpriseId)
        ));
    }

    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<BaseResponse<List<CitizenReportView>>> getWasteReportsByCitizen(
            @PathVariable UUID citizenId
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new BaseResponse<>(false, "Authentication required", null));
        }

        UUID currentUserId = (UUID) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_ADMIN"));

        if (!isAdmin && !currentUserId.equals(citizenId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new BaseResponse<>(false, "Access denied: You can only view your own reports", null));
        }

        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Get citizen waste reports successfully",
                wasteService.getWasteReportsByCitizen(citizenId)
        ));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<BaseResponse<WasteReportStatusResponse>> getWasteReportStatus(
            @PathVariable("id") @Positive Long reportId
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new BaseResponse<>(false, "Authentication required", null));
        }

        UUID currentUserId = (UUID) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_ADMIN"));

        UUID reportOwnerId = wasteService.getReportOwner(reportId);
        if (!isAdmin && !currentUserId.equals(reportOwnerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new BaseResponse<>(false, "Access denied: You can only view your own report status", null));
        }

        WasteReportStatusResponse status = wasteService.getReportStatus(reportId);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Get waste report status successfully",
                status
        ));
    }
}
