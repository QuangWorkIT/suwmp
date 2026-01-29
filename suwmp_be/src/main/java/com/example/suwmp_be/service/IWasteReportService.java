package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.view.CollectionRequestView;

import java.util.List;

public interface IWasteReportService {
    long createNewReport(WasteReportRequest wasteReport);
    List<CollectionRequestView> getWasteReportRequestsByEnterprise(Long enterpriseId);
}
