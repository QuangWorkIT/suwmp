package com.example.suwmp_be.controller;


import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.EnterpriseNearbyResponse;
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
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/waste-reports")
@Tag(name = "Waste Reports", description = "Waste report submission and lookup endpoints")
public class WasteReportController {
    private final IWasteReportService wasteService;

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

    @GetMapping("/enterprises/{enterpriseId}")
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
    public ResponseEntity<BaseResponse<List<ICollectionRequestView>>> getWasteReports(
            @Parameter(description = "Enterprise ID", required = true)
            @PathVariable @Positive Long enterpriseId
    ) {
        return ResponseEntity.ok(new BaseResponse<>(
                true, "Get waste reports successfully",
                wasteService.getWasteReportRequestsByEnterprise(enterpriseId)
        ));
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
            @Positive @RequestParam("longitude") double longitude,
            @Parameter(description = "Citizen latitude in decimal degrees", required = true, example = "10.77689")
            @Positive @RequestParam("latitude") double latitude,
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
}
