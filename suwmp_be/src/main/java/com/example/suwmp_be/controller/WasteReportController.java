package com.example.suwmp_be.controller;


import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.view.CollectionRequestView;
import com.example.suwmp_be.service.IWasteReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/waste-report")
public class WasteReportController {
    private final IWasteReportService wasteService;

    @PostMapping
    public ResponseEntity<BaseResponse<Long>> createWasteReport(
            @Valid @RequestBody WasteReportRequest request
    ) {
        return ResponseEntity.status(201)
                .body(new BaseResponse<>(
                        true,
                        "created report",
                        wasteService.createNewReport(request))
                );
    }

    @GetMapping("/enterprise/{enterpriseId}")
    public ResponseEntity<BaseResponse<List<CollectionRequestView>>> getWasteReports(
            @PathVariable Long enterpriseId
    ) {
        return ResponseEntity.ok(new BaseResponse<>(
                true, "Get waste reports successfully",
                wasteService.getWasteReportRequestsByEnterprise(enterpriseId)
        ));
    }
}
