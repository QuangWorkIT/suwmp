package com.example.suwmp_be.dto.history;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ReportHistoryDto {
    private Long id;
    private String status;
    private double volume;
    private double latitude;
    private double longitude;
    private String photoUrl;
    private LocalDateTime createdAt;
    private String wasteType;
    private int rewardPoints;
}
