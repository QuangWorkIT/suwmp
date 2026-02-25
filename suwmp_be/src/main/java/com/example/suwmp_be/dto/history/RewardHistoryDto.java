package com.example.suwmp_be.dto.history;

import com.example.suwmp_be.constants.WasteReportStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
public class RewardHistoryDto {

    private Long id;
    private Integer points;
    private String reason;
    private LocalDateTime createdAt;

    private String wasteType;
    private double longitude;
    private double latitude;
    private Double volume;
    private String status;

    public RewardHistoryDto(
            Long id,
            Integer points,
            String reason,
            LocalDateTime createdAt,
            String wasteType,
            double longitude,
            double latitude,
            Double volume,
            String status
    ) {
        this.id = id;
        this.points = points;
        this.reason = reason;
        this.createdAt = createdAt;
        this.wasteType = wasteType;
        this.longitude = longitude;
        this.latitude = latitude;
        this.volume = volume;
            this.status = status;
    }

    public RewardHistoryDto(
            Long id,
            Integer points,
            String reason,
            LocalDateTime createdAt,
            String wasteType,
            double longitude,
            double latitude,
            double volume,
            WasteReportStatus status
    ) {
        this.id = id;
        this.points = points;
        this.reason = reason;
        this.createdAt = createdAt;
        this.wasteType = wasteType;
        this.longitude = longitude;
        this.latitude = latitude;
        this.volume = volume;
        this.status = status != null ? status.name() : null;
    }

}

