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
    private long userGrowth;
    private long activeToday;
    private int activeTodayGrowth;
    private long openComplaints;
    private long openComplaintsDelta;
    private double systemHealthPercent;
    private String systemHealthStatus;
}
