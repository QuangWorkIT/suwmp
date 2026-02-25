package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.CreateCollectorRequest;
import com.example.suwmp_be.dto.request.UpdateCollectorRequest;
import com.example.suwmp_be.dto.response.CollectorResponse;
import com.example.suwmp_be.service.ICollectorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/enterprises/{enterpriseId}/collectors")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Collectors", description = "Collector management endpoints for enterprises")
public class CollectorController {

    private final ICollectorService collectorService;

    @GetMapping
    @Operation(
            summary = "Get all collectors",
            description = "Retrieve a paginated list of collectors for a specific enterprise"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Collectors retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BaseResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "404", description = "Enterprise not found")
    })
    public ResponseEntity<BaseResponse<Page<CollectorResponse>>> getCollectors(
            @Parameter(description = "Enterprise ID", required = true)
            @PathVariable Long enterpriseId,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        log.info("Received request to get collectors for enterpriseId: {}", enterpriseId);
        Page<CollectorResponse> response = collectorService.getCollectorsByEnterprise(enterpriseId, pageable);
        return ResponseEntity.ok(new BaseResponse<>(true, "Collectors retrieved successfully", response));
    }

    @PostMapping
    @Operation(
            summary = "Create a new collector",
            description = "Create a new collector account and link it to the enterprise. " +
                    "A new user account will be created with COLLECTOR role."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Collector created successfully",
                    content = @Content(schema = @Schema(implementation = CollectorResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid input data or email/phone already exists"),
            @ApiResponse(responseCode = "404", description = "Enterprise not found")
    })
    public ResponseEntity<BaseResponse<CollectorResponse>> createCollector(
            @Parameter(description = "Enterprise ID", required = true)
            @PathVariable Long enterpriseId,
            @Valid @RequestBody CreateCollectorRequest request) {
        log.info("Received request to create collector for enterpriseId: {}", enterpriseId);
        CollectorResponse response = collectorService.createCollector(enterpriseId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new BaseResponse<>(true, "Collector created successfully", response));
    }

    @PutMapping("/{collectorId}")
    @Operation(
            summary = "Update collector information",
            description = "Update collector details such as name, email, phone, or status"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Collector updated successfully",
                    content = @Content(schema = @Schema(implementation = CollectorResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid input data or email/phone already exists"),
            @ApiResponse(responseCode = "404", description = "Collector or enterprise not found")
    })
    public ResponseEntity<BaseResponse<CollectorResponse>> updateCollector(
            @Parameter(description = "Enterprise ID", required = true)
            @PathVariable Long enterpriseId,
            @Parameter(description = "Collector ID", required = true)
            @PathVariable UUID collectorId,
            @Valid @RequestBody UpdateCollectorRequest request) {
        log.info("Received request to update collector with id: {} for enterpriseId: {}", collectorId, enterpriseId);
        CollectorResponse response = collectorService.updateCollector(enterpriseId, collectorId, request);
        return ResponseEntity.ok(new BaseResponse<>(true, "Collector updated successfully", response));
    }

    @DeleteMapping("/{collectorId}")
    @Operation(
            summary = "Delete a collector",
            description = "Soft delete a collector by setting their status to INACTIVE. " +
                    "The collector account is not permanently removed."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Collector deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Collector or enterprise not found")
    })
    public ResponseEntity<BaseResponse<Void>> deleteCollector(
            @Parameter(description = "Enterprise ID", required = true)
            @PathVariable Long enterpriseId,
            @Parameter(description = "Collector ID", required = true)
            @PathVariable UUID collectorId) {
        log.info("Received request to delete collector with id: {} for enterpriseId: {}", collectorId, enterpriseId);
        collectorService.deleteCollector(enterpriseId, collectorId);
        return ResponseEntity.ok(new BaseResponse<>(true, "Collector deleted successfully", null));
    }
}

