package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.CitizenWasteReportStatusResponse;
import com.example.suwmp_be.dto.view.CollectionRequestView;

import java.util.List;
import java.util.UUID;

public interface IWasteReportService {
    long createNewReport(WasteReportRequest wasteReport);

    List<CollectionRequestView> getWasteReportRequestsByEnterprise(Long enterpriseId);

    CitizenWasteReportStatusResponse getCitizenReportStatus(Long reportId, UUID citizenId);

    List<CitizenWasteReportStatusResponse> getCitizenReports(UUID citizenId);
}

