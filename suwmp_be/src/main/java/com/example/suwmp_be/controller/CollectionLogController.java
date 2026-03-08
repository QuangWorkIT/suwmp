package com.example.suwmp_be.controller;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.CreateCollectionLogRequest;
import com.example.suwmp_be.exception.AuthenticationException;
import com.example.suwmp_be.service.ICollectionLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/collection-logs")
public class CollectionLogController {
    private final ICollectionLogService logService;

    @PreAuthorize("hasRole('COLLECTOR')")
    @PostMapping
    public ResponseEntity<BaseResponse<Long>> createCollectionLog(
            @RequestBody @Valid CreateCollectionLogRequest logRequest,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        if (userId == null || !userId.equals(UUID.fromString(logRequest.getCollectorId()))) {
            throw new AuthenticationException(ErrorCode.USER_NOT_COLLECTOR);
        }
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new BaseResponse<>(
                        true,
                        "Collection log created successfully",
                        logService.createCollectionLog(logRequest)
                ));
    }
}
