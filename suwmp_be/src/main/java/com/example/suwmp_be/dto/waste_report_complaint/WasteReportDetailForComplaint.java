package com.example.suwmp_be.dto.waste_report_complaint;

import java.util.UUID;

public record WasteReportDetailForComplaint(
        long id,
        UUID citizenId,
        String citizenName,
        int wasteTypeId,
        String wasteTypeName,
        long enterpriseId,
        String previousEnterprise,
        double latitude,
        double longitude,
        double volume
) { }
