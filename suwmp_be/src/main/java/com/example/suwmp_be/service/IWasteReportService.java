package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.EnterpriseNearbyResponse;
import com.example.suwmp_be.dto.view.IAssignedTaskView;
import com.example.suwmp_be.dto.view.ICollectionRequestView;
import com.example.suwmp_be.dto.response.CitizenWasteReportStatusResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.suwmp_be.dto.request.RatingRequest;
import com.example.suwmp_be.dto.response.RatingStatusResponse;

import java.util.List;
import java.util.UUID;

public interface IWasteReportService {
    long createNewReport(WasteReportRequest wasteReport);

    Page<ICollectionRequestView> getWasteReportRequestsByEnterprise(UUID enterpriseId, Pageable pageable);

    List<EnterpriseNearbyResponse> getEnterprisesNearby(Double longitude, Double latitude, Long wasteTypeId);

    long cancelWasteReport(Long wasteReportId, String note);

    long updateStatusWasteReport(Long wasteReportId, String status);

    CitizenWasteReportStatusResponse getCitizenReportStatus(Long reportId, UUID citizenId);

    List<CitizenWasteReportStatusResponse> getCitizenReports(UUID citizenId);

    void submitRating(Long reportId, UUID citizenId, RatingRequest ratingRequest);

    RatingStatusResponse getRatingStatus(Long reportId, UUID citizenId);

    Page<IAssignedTaskView> getCollectorAssignedTasks(UUID collectorId, Pageable pageable);
}
