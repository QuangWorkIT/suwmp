package com.example.suwmp_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private Long userGrowth;
    private long activeToday;
    private Long activeTodayGrowth;
    private long openComplaints;
    private Long openComplaintsDelta;
    private Double systemHealthPercent;
    private String systemHealthStatus;
}
