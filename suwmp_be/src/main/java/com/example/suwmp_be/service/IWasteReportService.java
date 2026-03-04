package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.AttachmentResponse;
import com.example.suwmp_be.dto.response.CitizenWasteReportStatusResponse;
import com.example.suwmp_be.dto.response.EnterpriseNearbyResponse;
import com.example.suwmp_be.dto.view.IAssignedTaskView;
import com.example.suwmp_be.dto.view.ICollectionRequestView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface IWasteReportService {
    long createNewReport(WasteReportRequest wasteReport);

    Page<ICollectionRequestView> getWasteReportRequestsByEnterprise(UUID enterpriseId, Pageable pageable);

    List<EnterpriseNearbyResponse> getEnterprisesNearbyCitizen(Double citizenLong, Double citizenLat, Long wasteTypeId);

    long cancelWasteReport(Long wasteReportId, String note);

    CitizenWasteReportStatusResponse getCitizenReportStatus(Long reportId, UUID citizenId);

    List<CitizenWasteReportStatusResponse> getCitizenReports(UUID citizenId);

    Page<IAssignedTaskView> getCollectorAssignedTasks(UUID collectorId, Pageable pageable);

    List<AttachmentResponse> getAttachments(Long reportId, UUID citizenId);

    void uploadAttachments(Long reportId, UUID citizenId, List<MultipartFile> files, String description) throws IOException;
}
