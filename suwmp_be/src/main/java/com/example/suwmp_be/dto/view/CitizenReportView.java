package com.example.suwmp_be.dto.view;

import java.time.Instant;

public interface CitizenReportView {
    Long getReportId();
    String getWasteTypeName();
    Double getLongitude();
    Double getLatitude();
    Double getVolume();
    String getStatus();
    Instant getCreatedAt();
}

