package com.example.suwmp_be.constants;

public enum ReportStatus {
    PENDING,
    ACCEPTED,
    ASSIGNED,
    COLLECTED;

    public static ReportStatus from(String value) {
        return ReportStatus.valueOf(value.toUpperCase());
    }
}

