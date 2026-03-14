package com.example.suwmp_be.dto.waste_report_complaint;

import jakarta.validation.constraints.Positive;

public record WasteReportCreateForComplaintRequest(
        @Positive
        long enterpriseId
) { }
