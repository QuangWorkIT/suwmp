package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.collector_dashboard.FeedbackDTO;
import com.example.suwmp_be.dto.collector_dashboard.SummaryDTO;
import com.example.suwmp_be.dto.collector_dashboard.TaskDTO;
import com.example.suwmp_be.service.ICollectorDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/collector-dashboard")
@RequiredArgsConstructor
public class CollectorDashboardController {
    private final ICollectorDashboardService collectorDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<BaseResponse<SummaryDTO>> getCollectorDashboardSummary(
            Authentication authentication
    ) {
        SummaryDTO response = collectorDashboardService.getDashboardSummary((UUID) authentication.getPrincipal());

        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Summary retrieve successfully",
                response
        ));
    }

    @GetMapping("/tasks")
    public ResponseEntity<BaseResponse<List<TaskDTO>>> getTasks(
            Authentication authentication,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng
    ) {
        List<TaskDTO> tasks = collectorDashboardService.getTasks((UUID) authentication.getPrincipal(), lat, lng);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Tasks fetched",
                tasks));
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<BaseResponse<List<FeedbackDTO>>> getFeedbacks(
            Authentication authentication
    ) {
        List<FeedbackDTO> feedbacks = collectorDashboardService.getRecentFeedbacks((UUID) authentication.getPrincipal());
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Feedbacks fetched",
                feedbacks));
    }
}
