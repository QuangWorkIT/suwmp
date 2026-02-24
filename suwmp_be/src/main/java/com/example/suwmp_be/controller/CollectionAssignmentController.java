package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.AssignCollectorRequest;
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

    @PostMapping("/assignments")
    public ResponseEntity<BaseResponse<Long>> assignCollector(
            @Valid @RequestBody AssignCollectorRequest payload) {
        return ResponseEntity.status(201)
                .body(new BaseResponse<>(
                        true,
                        "Assign collector successfully for "
                                +  caService.assignCollector(payload) + " waste reports")
                );
    }
}
