package com.example.suwmp_be.constants;

public enum ReportStatus {
    PENDING,
    ACCEPTED,
    ASSIGNED,
    COLLECTED;

    public static ReportStatus from(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("ReportStatus value must not be null or blank");
        }

        String normalized = value.trim().toUpperCase();
        try {
            return ReportStatus.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unknown ReportStatus value: " + value, ex);
        }
    }
}

