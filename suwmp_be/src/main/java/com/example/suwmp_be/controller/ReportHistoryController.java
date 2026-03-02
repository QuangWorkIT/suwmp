package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.history.ReportHistoryDto;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.serviceImpl.ReportHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/citizen/reports")
@RequiredArgsConstructor
public class ReportHistoryController {
    private final ReportHistoryService reportHistoryService;

    @GetMapping("/history")
    public ResponseEntity<List<ReportHistoryDto>> getHistory(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                reportHistoryService.getReportHistoryByCitizenId(user.getId())
        );
    }
}
