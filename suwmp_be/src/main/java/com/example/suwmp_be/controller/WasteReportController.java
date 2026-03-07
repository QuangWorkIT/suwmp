package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.PaginatedResponse;
import com.example.suwmp_be.dto.request.CancelWasteReportRequest;
import com.example.suwmp_be.dto.request.RatingRequest;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.CitizenWasteReportStatusResponse;
import com.example.suwmp_be.dto.response.EnterpriseNearbyResponse;
import com.example.suwmp_be.dto.response.RatingStatusResponse;
import com.example.suwmp_be.dto.view.IAssignedTaskView;
import com.example.suwmp_be.dto.view.ICollectionRequestView;
import com.example.suwmp_be.service.IWasteReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/waste-reports")
@Tag(name = "Waste Reports", description = "Waste report submission and lookup endpoints")
public class WasteReportController {
    private final IWasteReportService wasteService;

    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping
    @Operation(
            summary = "Create a waste report",
            description = "Submit a new waste report from a citizen with waste type, quantity, and location details."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Waste report created successfully",
                    content = @Content(schema = @Schema(implementation = BaseResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
    })
    public ResponseEntity<BaseResponse<Long>> createWasteReport(
            @Parameter(description = "Waste report payload", required = true)
            @Valid @RequestBody WasteReportRequest request
    ) {
        return ResponseEntity.status(201)
                .body(new BaseResponse<>(
                        true,
                        "created report",
                        wasteService.createNewReport(request))
                );
    }

    @PreAuthorize("hasRole('ENTERPRISE')")
    @GetMapping("/enterprises/requests/me")
    @Operation(
            summary = "Get waste reports for an enterprise",
            description = "Retrieve all waste report requests assigned to a specific enterprise."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Waste reports retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BaseResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid enterprise ID"),
            @ApiResponse(responseCode = "404", description = "Enterprise not found")
    })
    public ResponseEntity<PaginatedResponse<ICollectionRequestView>> getWasteReports(
            @Parameter(description = "Enterprise ID", required = true)
            Authentication authentication,
            @PageableDefault(page = 0, size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ICollectionRequestView> collectionRequests =
                wasteService.getWasteReportRequestsByEnterprise((UUID) authentication.getPrincipal(), pageable);

        PaginatedResponse<ICollectionRequestView> response =
                PaginatedResponse.buildPaginatedResponse(collectionRequests);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/{id}/status")
    public ResponseEntity<BaseResponse<CitizenWasteReportStatusResponse>> getCitizenReportStatus(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        UUID citizenId = (UUID) authentication.getPrincipal();
        CitizenWasteReportStatusResponse response =
                wasteService.getCitizenReportStatus(id, citizenId);

        return ResponseEntity.ok(
                new BaseResponse<>(
                        true,
                        "Get waste report status successfully",
                        response
                )
        );
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/citizen/me")
    public ResponseEntity<BaseResponse<List<CitizenWasteReportStatusResponse>>> getMyReports(
            Authentication authentication
    ) {
        UUID citizenId = (UUID) authentication.getPrincipal();
        List<CitizenWasteReportStatusResponse> reports =
                wasteService.getCitizenReports(citizenId);

        return ResponseEntity.ok(
                new BaseResponse<>(
                        true,
                        "Get citizen waste reports successfully",
                        reports
                )
        );
    }

    @GetMapping("/enterprises/nearby/citizens")
    @Operation(
            summary = "Find nearby enterprises for a citizen",
            description = "Find enterprises that can collect a specific waste type near the citizen's location."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Nearby enterprises retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BaseResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid query parameters"),
    })
    public ResponseEntity<BaseResponse<List<EnterpriseNearbyResponse>>> getNearByEnterprises(
            @Parameter(description = "Citizen longitude in decimal degrees", required = true, example = "106.70098")
            @DecimalMin("-180.0") @DecimalMax("180.0") @RequestParam("longitude") double longitude,
            @Parameter(description = "Citizen latitude in decimal degrees", required = true, example = "10.77689")
            @DecimalMin("-90.0") @DecimalMax("90.0") @RequestParam("latitude") double latitude,
            @Parameter(description = "Waste type ID to match enterprise capability", required = true, example = "1")
            @Positive @RequestParam("wasteTypeId") long wasteTypeId
    ) {
        return ResponseEntity.ok(new BaseResponse<>(
                true, "Get nearby enterprises success",
                wasteService.getEnterprisesNearbyCitizen(
                        longitude,
                        latitude,
                        wasteTypeId)
        ));
    }

    @PreAuthorize("hasRole('ENTERPRISE')")
    @PatchMapping("/enterprises/cancellation")
    public ResponseEntity<BaseResponse<Long>> cancelWasteReportRequest(
            @Valid @RequestBody CancelWasteReportRequest rq
    ) {
        return ResponseEntity.status(200).body(new BaseResponse<>(
                true,
                "Canceled waste report request",
                wasteService.cancelWasteReport(rq.getWasteReportId(), rq.getNote()))
        );
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping("/{id}/rating")
    @Operation(
            summary = "Submit a rating for a waste report",
            description = "Submit a star rating (1-5) for a completed waste report."
    )
    public ResponseEntity<BaseResponse<Void>> submitRating(
            @PathVariable @Positive Long id,
            @Valid @RequestBody RatingRequest request,
            Authentication authentication
    ) {
        UUID citizenId = (UUID) authentication.getPrincipal();
        wasteService.submitRating(id, citizenId, request);
        return ResponseEntity.ok(new BaseResponse<>(true, "Submitted rating successfully"));
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/{id}/rating")
    @Operation(
            summary = "Get rating status for a waste report",
            description = "Check if a report can be rated and see existing rating summary."
    )
    public ResponseEntity<BaseResponse<RatingStatusResponse>> getRatingStatus(
            @PathVariable @Positive Long id,
            Authentication authentication
    ) {
        UUID citizenId = (UUID) authentication.getPrincipal();
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Get rating status successfully",
                wasteService.getRatingStatus(id, citizenId)
        ));
    }

    @PreAuthorize("hasRole('COLLECTOR')")
    @GetMapping("/collectors/tasks/me")
    public ResponseEntity<PaginatedResponse<IAssignedTaskView>> getCollectorTasks(
            Authentication authentication,
            @PageableDefault(page = 0, size = 4, sort = "startCollectAt", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<IAssignedTaskView> tasks = wasteService.getCollectorAssignedTasks(
                (UUID) authentication.getPrincipal(), pageable);

        PaginatedResponse<IAssignedTaskView> response = PaginatedResponse.buildPaginatedResponse(tasks);
        return ResponseEntity.ok(response);
    }

}

