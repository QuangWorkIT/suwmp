package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.CreateCollectionAssignment;
import com.example.suwmp_be.service.ICollectionAssignmentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ca")
@AllArgsConstructor
public class CollectionAssignmentController {
    private final ICollectionAssignmentService caService;

    @PostMapping
    public ResponseEntity<BaseResponse<Long>> createCollectionAssignment(
            @Valid @RequestBody CreateCollectionAssignment payload) {
        return ResponseEntity.status(201)
                .body(new BaseResponse<>(
                        true,
                        "Create assignment successfully",
                        caService.createACollectionAssignment(payload)));
    }
}
