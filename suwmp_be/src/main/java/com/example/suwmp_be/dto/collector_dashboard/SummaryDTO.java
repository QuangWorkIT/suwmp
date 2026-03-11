package com.example.suwmp_be.dto.collector_dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class SummaryDTO {
    private int totalTasksToday;
    private int completedTasksToday;
    private int remainingTasksToday;
    private int avgResponseTimeMins;
    private double averageRating;
    private String estimatedCompletionTime;
    private String scheduleStatus;
}
