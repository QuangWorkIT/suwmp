package com.example.suwmp_be.controller;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.PaginatedResponse;
import com.example.suwmp_be.dto.request.CreateCollectionLogRequest;
import com.example.suwmp_be.dto.view.ICollectionLogHistoryView;
import com.example.suwmp_be.exception.AuthenticationException;
import com.example.suwmp_be.service.ICollectionLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    @PreAuthorize("hasRole('COLLECTOR')")
    @GetMapping("/history")
    public ResponseEntity<PaginatedResponse<ICollectionLogHistoryView>> getCollectionLogHistory(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();
        if (userId == null) {
            throw new AuthenticationException(ErrorCode.USER_NOT_COLLECTOR);
        }

        PaginatedResponse<ICollectionLogHistoryView> response = PaginatedResponse
                .buildPaginatedResponse(logService.findCollectionLogHistoryByCollector(pageable, userId));

        return ResponseEntity.ok(response);
    }
}
