package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.complaint.ComplaintDTO;
import com.example.suwmp_be.dto.complaint.CreateComplaintRequest;
import com.example.suwmp_be.dto.complaint.UpdateComplaintStatus;
import com.example.suwmp_be.dto.response.ComplaintResponse;
import com.example.suwmp_be.service.IComplaintService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final IComplaintService complaintService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<BaseResponse<ComplaintDTO>> createComplaint(
            Authentication authentication,
            @Valid @RequestBody CreateComplaintRequest request
    ) {
        var complaint = complaintService.createComplaint(
                (UUID) authentication.getPrincipal(),
                request.getWasteReportId(),
                request.getDescription(),
                request.getPhotoUrl()
        );
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Complaint created successfully",
                complaint
        ));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<BaseResponse<Page<ComplaintResponse>>> getAllComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        var complaints = complaintService.getAllComplaints(Pageable.ofSize(size).withPage(page));
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Complaints retrieved successfully",
                complaints
        ));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<ComplaintDTO>> getComplaintById(@PathVariable Long id) {
        var complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Complaint retrieved successfully",
                complaint
        ));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<BaseResponse<ComplaintDTO>> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody UpdateComplaintStatus status
    ) {
        var complaint = complaintService.updateComplaintStatus(id, status);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Complaint status update successfully",
                complaint
        ));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user")
    public ResponseEntity<BaseResponse<Page<ComplaintResponse>>> getAllComplaintsByUserId(
            Authentication authentication,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "5") @Min(1) int size
    ) {
        var complaints = complaintService.getAllComplaintsByUserId((UUID) authentication.getPrincipal(), Pageable.ofSize(size).withPage(page));
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "User complaints retrieved successfully",
                complaints
        ));
    }
}
