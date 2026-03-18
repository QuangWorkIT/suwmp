package com.example.suwmp_be.constants;

public enum WasteReportStatus {
    PENDING,
    REJECTED,
    CANCELLED,
    ASSIGNED,
    ON_THE_WAY,
    COLLECTED;

    public static WasteReportStatus from(String status) {
        try {
            return WasteReportStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid waste report status: " + status);
        }
    }
}
