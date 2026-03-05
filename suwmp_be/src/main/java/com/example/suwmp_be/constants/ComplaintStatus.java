package com.example.suwmp_be.constants;

public enum ComplaintStatus {
    OPEN,
    IN_PROGRESS,
    RESOLVED;

    public static ComplaintStatus from(String status) {
        try {
            return ComplaintStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid complaint status: " + status);
        }
    }
}