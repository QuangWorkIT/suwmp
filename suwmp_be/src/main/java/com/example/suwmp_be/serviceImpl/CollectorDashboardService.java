package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.collector_dashboard.FeedbackDTO;
import com.example.suwmp_be.dto.collector_dashboard.SummaryDTO;
import com.example.suwmp_be.dto.collector_dashboard.TaskDTO;
import com.example.suwmp_be.repository.CollectorDashboardRepository;
import com.example.suwmp_be.service.ICollectorDashboardService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Data
@RequiredArgsConstructor
public class CollectorDashboardService implements ICollectorDashboardService {

    private final CollectorDashboardRepository collectorDashboardRepository;

    @Override
    public SummaryDTO getDashboardSummary(UUID collectorId) {
        Map<String, Object> stats = collectorDashboardRepository.getTodaySummaryStats(collectorId, LocalDate.now());
        Double avgRating = collectorDashboardRepository.getOverallAverageRating(collectorId);

        // Safely extract and cast numbers from the Map
        int total = stats.get("total_tasks") != null ? ((Number) stats.get("total_tasks")).intValue() : 0;
        int completed = stats.get("completed_tasks") != null ? ((Number) stats.get("completed_tasks")).intValue() : 0;
        double avgResponse = stats.get("avg_response_time") != null ? ((Number) stats.get("avg_response_time")).doubleValue() : 0.0;

        int remaining = total - completed;

        return SummaryDTO.builder()
                .totalTasksToday(total)
                .completedTasksToday(completed)
                .remainingTasksToday(remaining)
                .avgResponseTimeMins((int) avgResponse)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .estimatedCompletionTime(calculateCompletionTime(remaining))
                .scheduleStatus(remaining == 0 && total > 0 ? "Completed" : "On Schedule")
                .build();
    }

    @Override
    public List<TaskDTO> getTasks(UUID collectorId, Double currentLat, Double currentLng) {
        double lat = currentLat != null ? currentLat : 0.0;
        double lng = currentLng != null ? currentLng : 0.0;

        List<Map<String, Object>> rawTasks = collectorDashboardRepository.getTodayTasks(collectorId, lat, lng);

        return rawTasks.stream().map(row -> {
            double distance = row.get("distance_km") != null ? ((Number) row.get("distance_km")).doubleValue() : 0.0;

            return TaskDTO.builder()
                    .taskId(((Number) row.get("task_id")).longValue())
                    .wasteType(formatWasteType((String) row.get("waste_type")))
                    .status(formatStatus((String) row.get("status")))
                    .isPriority("URGENT".equals(row.get("priority")))
                    .citizenName((String) row.get("citizen_name"))
                    .distanceKm(Math.round(distance * 10.0) / 10.0)
                    .estimatedMins(calculateEstimatedMins(distance))
                    .build();
        }).toList();
    }

    @Override
    public List<FeedbackDTO> getRecentFeedbacks(UUID collectorId) {
        List<Map<String, Object>> rawFeedbacks = collectorDashboardRepository.getRecentFeedbacks(collectorId);

        return rawFeedbacks.stream().map(row -> {
            Object dateObj = row.get("created_at");
            Instant createdAtInstant;

            if (dateObj instanceof Instant) {
                createdAtInstant = (Instant) dateObj;
            } else if (dateObj instanceof java.sql.Timestamp) {
                createdAtInstant = ((java.sql.Timestamp) dateObj).toInstant();
            } else if (dateObj instanceof java.time.LocalDateTime) {
                createdAtInstant = ((java.time.LocalDateTime) dateObj)
                        .atZone(java.time.ZoneId.systemDefault())
                        .toInstant();
            } else {
                createdAtInstant = Instant.now();
            }

            String wasteType = (String) row.get("waste_type");

            return FeedbackDTO.builder()
                    .ratingId(((Number) row.get("rating_id")).longValue())
                    .citizenName((String) row.get("citizen_name"))
                    .rating(((Number) row.get("rating")).intValue())
                    .timeAgo(calculateTimeAgo(createdAtInstant))
                    .comment(wasteType)
                    .build();
        }).toList();
    }

    private String formatWasteType(String dbType) {
        if (dbType == null) return "Unknown";
        return dbType.substring(0, 1).toUpperCase() + dbType.substring(1).toLowerCase() + " Waste";
    }

    private String formatStatus(String dbStatus) {
        if ("ON_THE_WAY".equals(dbStatus) || "ASSIGNED".equals(dbStatus)) return "In Progress";
        if ("PENDING".equals(dbStatus)) return "Assigned";
        return dbStatus;
    }

    private int calculateEstimatedMins(Double distanceKm) {
        return (int) Math.max(5, Math.round(distanceKm * 3) + 5);
    }

    private String calculateCompletionTime(int remainingTasks) {
        if (remainingTasks == 0) return "--:--";
        return "ETA ~" + (remainingTasks * 20) + "m";
    }

    private String calculateTimeAgo(Instant createdAt) {
        long hours = Duration.between(createdAt, Instant.now()).toHours();
        if (hours < 24) return "Today";
        if (hours < 48) return "Yesterday";
        return (hours / 24) + " days ago";
    }

}
