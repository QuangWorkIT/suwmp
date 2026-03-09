package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;

import com.example.suwmp_be.dto.response.ComplaintResponse;
import com.example.suwmp_be.dto.response.DashboardStatsResponse;
import com.example.suwmp_be.dto.response.UserResponse;
import com.example.suwmp_be.serviceImpl.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<BaseResponse<DashboardStatsResponse>> getStats() {
        return ResponseEntity.ok(new BaseResponse<>(true, "Stats fetched successfully", adminDashboardService.getDashboardStats()));
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<BaseResponse<Page<UserResponse>>> getPagedUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(new BaseResponse<>(true, "Users fetched successfully", adminDashboardService.getPagedUsers(pageable)));
    }

    @GetMapping("/complaints/open")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<BaseResponse<List<ComplaintResponse>>> getOpenComplaints(
            @RequestParam(defaultValue = "3") int limit
    ) {
        return ResponseEntity.ok(new BaseResponse<>(true, "Recent complaints fetched successfully", adminDashboardService.getRecentOpenComplaints(limit)));
    }


}
