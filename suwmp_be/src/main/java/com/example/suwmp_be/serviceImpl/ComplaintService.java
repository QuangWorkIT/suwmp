package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ComplaintStatus;
import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.complaint.ComplaintDTO;
import com.example.suwmp_be.dto.complaint.UpdateComplaintStatus;
import com.example.suwmp_be.dto.mapper.ComplaintMapper;
import com.example.suwmp_be.dto.response.ComplaintResponse;
import com.example.suwmp_be.entity.Complaint;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.ComplaintRepository;
import com.example.suwmp_be.service.IComplaintService;
import com.example.suwmp_be.service.IS3Service;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ComplaintService implements IComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintMapper complaintMapper;
    private final IS3Service s3Service;
    private final UserRepository userRepository;
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
    @Transactional
    public ComplaintDTO createComplaint(UUID userId, Long wasteReportId, String description, String photoUrl) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));
        var report = wasteReportRepository.findById(wasteReportId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND));

        Complaint complaint = Complaint.builder()
                .citizen(user)
                .wasteReport(report)
                .description(description)
                .photoUrl(photoUrl)
                .status(ComplaintStatus.OPEN)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return complaintMapper.toDTO(saved);
    }
}
