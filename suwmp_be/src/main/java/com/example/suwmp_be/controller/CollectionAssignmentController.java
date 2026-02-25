package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.AssignCollectorRequest;
import com.example.suwmp_be.service.ICollectionAssignmentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ca")
@AllArgsConstructor
@Validated
public class CollectionAssignmentController {
    private final ICollectionAssignmentService caService;

    @PreAuthorize("hasRole('ENTERPRISE')")
    @PostMapping("/assignments")
    public ResponseEntity<BaseResponse<Long>> assignCollector(
            @Valid @RequestBody AssignCollectorRequest payload) {
        Long count = caService.assignCollector(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new BaseResponse<>(true,
                        "Assigned collector successfully for " + count + " waste reports",
                        count));
    }
}
