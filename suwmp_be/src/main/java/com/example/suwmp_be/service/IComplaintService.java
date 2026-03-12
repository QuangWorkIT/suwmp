package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.complaint.ComplaintDTO;
import com.example.suwmp_be.dto.complaint.ComplaintGetResponse;
import com.example.suwmp_be.dto.complaint.ComplaintUpdateStatusWithReportIdRequest;
import com.example.suwmp_be.dto.complaint.UpdateComplaintStatus;
import com.example.suwmp_be.dto.response.ComplaintResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface IComplaintService {
    Page<ComplaintResponse> getAllComplaints(Pageable pageable);
    ComplaintDTO getComplaintById(Long id);
    ComplaintDTO updateComplaintStatus(Long id, UpdateComplaintStatus status);

    Page<ComplaintResponse> getAllComplaintsByUserId(UUID userId, Pageable pageable);

    ComplaintDTO submitIssueReport(Long reportId, UUID userId, String description, MultipartFile file);

    ComplaintDTO getIssueReport(Long reportId, UUID userId);

    ComplaintGetResponse getComplaintWithWasteReportById(long id);

    void updateComplaintStatusWithWasteReportId(long newWasteReportId, ComplaintUpdateStatusWithReportIdRequest request);
}
