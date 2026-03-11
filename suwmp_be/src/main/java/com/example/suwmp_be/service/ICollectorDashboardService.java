package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.collector_dashboard.FeedbackDTO;
import com.example.suwmp_be.dto.collector_dashboard.SummaryDTO;
import com.example.suwmp_be.dto.collector_dashboard.TaskDTO;

import java.util.List;
import java.util.UUID;

public interface ICollectorDashboardService {
    SummaryDTO getDashboardSummary(UUID collectorId);
    List<TaskDTO> getTasks(UUID collectorId, Double currentLat, Double currentLng);
    List<FeedbackDTO> getRecentFeedbacks(UUID collectorId);
}
