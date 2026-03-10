package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.citizen_dashboard.CitizenWidgetDTO;
import com.example.suwmp_be.dto.citizen_dashboard.MonthlyProgressDTO;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetRequest;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetResponse;
import com.example.suwmp_be.service.ICitizenDashboardService;
import com.example.suwmp_be.serviceImpl.CitizenServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/citizens")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CitizenController {
    final CitizenServiceImpl citizenService;
    final ICitizenDashboardService citizenDashboardService;

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/profile/{citizenId}")
    public ResponseEntity<BaseResponse<CitizenProfileGetResponse>> getCitizenProfile(@PathVariable UUID citizenId) {
        CitizenProfileGetResponse response = citizenService.getCitizenProfile(new CitizenProfileGetRequest(citizenId));

        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(
                        true,
                        "Get citizen profile successfully",
                        response
                ));
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/dashboard/widgets")
    public ResponseEntity<BaseResponse<CitizenWidgetDTO>> getWidgets(
            Authentication authentication
    ) {
        var data = citizenDashboardService.getTopWidgets((UUID) authentication.getPrincipal());
        return ResponseEntity.status(HttpStatus.OK).body(
                new BaseResponse<>(true, "Get widgets successful", data)
        );
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/dashboard/monthly-progress")
    public ResponseEntity<BaseResponse<MonthlyProgressDTO>> getMonthlyProgress(
            Authentication authentication
    ) {
        var data = citizenDashboardService.getMonthlyProgress((UUID) authentication.getPrincipal());
        return ResponseEntity.status(HttpStatus.OK).body(
                new BaseResponse<>(true, "Get monthly progress successful", data)
        );
    }
}
