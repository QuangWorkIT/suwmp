package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.WasteReportRequest;

public interface WasteReportService {
    long createNewReport(WasteReportRequest wasteReport);
}
