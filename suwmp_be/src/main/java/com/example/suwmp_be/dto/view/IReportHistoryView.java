package com.example.suwmp_be.dto.view;

import java.time.LocalDateTime;

public interface IReportHistoryView {
    Long getId();
    String getStatus();
    double getVolume();
    double getLatitude();
    double getLongitude();
    String getPhotoUrl();
    LocalDateTime getCreatedAt();
    String getWasteTypeName();
    int getRewardPoints();
}