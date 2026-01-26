package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.WasteReportRequest;

public interface IWasteReportService {
    long createNewReport(WasteReportRequest wasteReport);
}
