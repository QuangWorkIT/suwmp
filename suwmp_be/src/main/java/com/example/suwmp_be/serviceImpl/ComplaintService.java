package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ComplaintStatus;
import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.complaint.ComplaintDTO;
import com.example.suwmp_be.dto.complaint.ComplaintGetResponse;
import com.example.suwmp_be.dto.complaint.UpdateComplaintStatus;
import com.example.suwmp_be.dto.mapper.ComplaintMapper;
import com.example.suwmp_be.dto.response.ComplaintResponse;
import com.example.suwmp_be.entity.Complaint;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.exception.*;
import com.example.suwmp_be.repository.ComplaintRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.IComplaintService;
import com.example.suwmp_be.service.IS3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ComplaintService implements IComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintMapper complaintMapper;
    private final IS3Service s3Service;
    private final WasteReportRepository wasteReportRepository;

    @Override
    public Page<ComplaintResponse> getAllComplaints(Pageable pageable) {
        Page<Complaint> complaints = complaintRepository.findAllOrderByCustomStatus(pageable);
        return complaintMapper.toPageResponse(complaints);
    }

    @Override
    public ComplaintDTO getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_DATA));
        ComplaintDTO dto = complaintMapper.toDTO(complaint);
        if (complaint.getPhotoUrl() != null) {
            String presignedUrl = s3Service.generatePresignedUrl(complaint.getPhotoUrl());
            dto.setPhotoUrl(presignedUrl);
        }
        return dto;
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

        User citizen = report.getCitizen();

        Complaint complaint = Complaint.builder()
                .citizen(citizen)
                .wasteReport(report)
                .description(description)
                .photoUrl(photoUrl)
                .status(ComplaintStatus.OPEN)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        ComplaintDTO dto = complaintMapper.toDTO(saved);
        if (saved.getPhotoUrl() != null) {
            dto.setPhotoUrl(s3Service.generatePresignedUrl(saved.getPhotoUrl()));
        }
        return dto;
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

        ComplaintDTO dto = complaintMapper.toDTO(complaint);
        if (complaint.getPhotoUrl() != null) {
            dto.setPhotoUrl(s3Service.generatePresignedUrl(complaint.getPhotoUrl()));
        }

        return dto;
    }

    private void validateFile(MultipartFile file) {
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new BadRequestException(ErrorCode.INVALID_FILE_TYPE);
        }
        contentType = contentType.toLowerCase();

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new BadRequestException(ErrorCode.INVALID_FILE_TYPE);
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();

        boolean isValid = false;
        if (contentType.equals("image/jpeg") && (extension.equals(".jpg") || extension.equals(".jpeg"))) {
            isValid = true;
        } else if (contentType.equals("image/png") && extension.equals(".png")) {
            isValid = true;
        } else if (contentType.equals("application/pdf") && extension.equals(".pdf")) {
            isValid = true;
        }

        if (!isValid) {
            throw new BadRequestException(ErrorCode.INVALID_FILE_TYPE);
        }
    }

    @Override
    public ComplaintGetResponse getComplaintWithWasteReportById(long id) {
        var complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.COMPLAINT_NOT_FOUND));
        return complaintMapper.toComplaintGetResponse(complaint);
    }
}
