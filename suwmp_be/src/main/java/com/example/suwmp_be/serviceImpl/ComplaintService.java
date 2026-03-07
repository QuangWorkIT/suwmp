package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ComplaintStatus;
import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.complaint.ComplaintDTO;
import com.example.suwmp_be.dto.complaint.UpdateComplaintStatus;
import com.example.suwmp_be.dto.mapper.ComplaintMapper;
import com.example.suwmp_be.dto.response.ComplaintResponse;
import com.example.suwmp_be.entity.Complaint;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.exception.*;
import com.example.suwmp_be.repository.ComplaintRepository;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.IComplaintService;
import com.example.suwmp_be.service.IS3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ComplaintService implements IComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintMapper complaintMapper;
    private final IS3Service s3Service;
    private final WasteReportRepository wasteReportRepository;
    private final UserRepository userRepository;

    @Override
    public Page<ComplaintResponse> getAllComplaints(Pageable pageable) {
        Page<Complaint> complaints = complaintRepository.findAllOrderByCustomStatus(pageable);
        return complaintMapper.toPageResponse(complaints);
    }

    @Override
    public ComplaintDTO getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_DATA));
        if (complaint.getPhotoUrl() != null) {
            String presignedUrl = s3Service.generatePresignedUrl(complaint.getPhotoUrl());
            complaint.setPhotoUrl(presignedUrl);
        }
        return complaintMapper.toDTO(complaint);
    }

    @Override
    public ComplaintDTO updateComplaintStatus(Long id, UpdateComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_DATA));
        complaint.setStatus(status.getStatus());
        Complaint updatedComplaint = complaintRepository.save(complaint);
        return complaintMapper.toDTO(updatedComplaint);
    }

    @Override
    public Page<ComplaintResponse> getAllComplaintsByUserId(UUID userId, Pageable pageable) {
        Page<Complaint> complaints = complaintRepository.findAllByCitizenId(userId, pageable);
        return complaintMapper.toPageResponse(complaints);
    }

    @Override
    public ComplaintDTO submitIssueReport(Long reportId, UUID userId, String description, MultipartFile file) {
        if (description == null || description.isBlank()) {
            throw new BadRequestException(ErrorCode.VALIDATION_FAILED);
        }

        WasteReport report = wasteReportRepository.findById(reportId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND));

        if (!report.getCitizen().getId().equals(userId)) {
            throw new ForbiddenException(ErrorCode.REPORT_NOT_OWNED);
        }

        if (complaintRepository.findByWasteReport_Id(reportId).isPresent()) {
            throw new ConflictException(ErrorCode.ISSUE_ALREADY_SUBMITTED);
        }

        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            validateFile(file);
            try {
                photoUrl = s3Service.uploadImg(file);
            } catch (IOException e) {
                throw new ApplicationException(ErrorCode.ERROR_SYSTEM);
            }
        }

        User citizen = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        Complaint complaint = Complaint.builder()
                .citizen(citizen)
                .wasteReport(report)
                .description(description)
                .photoUrl(photoUrl)
                .status(ComplaintStatus.OPEN)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return complaintMapper.toDTO(saved);
    }

    @Override
    public ComplaintDTO getIssueReport(Long reportId, UUID userId) {
        WasteReport report = wasteReportRepository.findById(reportId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND));

        if (!report.getCitizen().getId().equals(userId)) {
            throw new ForbiddenException(ErrorCode.REPORT_NOT_OWNED);
        }

        Complaint complaint = complaintRepository.findByWasteReport_Id(reportId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_DATA));

        if (complaint.getPhotoUrl() != null) {
            complaint.setPhotoUrl(s3Service.generatePresignedUrl(complaint.getPhotoUrl()));
        }

        return complaintMapper.toDTO(complaint);
    }

    private void validateFile(MultipartFile file) {
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        String contentType = file.getContentType();
        List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png", "application/pdf");
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new BadRequestException(ErrorCode.INVALID_FILE_TYPE);
        }
    }
}
