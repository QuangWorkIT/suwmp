package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.constants.WasteReportStatus;
import com.example.suwmp_be.dto.mapper.WasteReportMapper;
import com.example.suwmp_be.dto.request.RatingRequest;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.CitizenWasteReportStatusResponse;
import com.example.suwmp_be.dto.response.EnterpriseNearbyResponse;
import com.example.suwmp_be.dto.response.RatingStatusResponse;
import com.example.suwmp_be.dto.view.ICollectionRequestView;
import com.example.suwmp_be.dto.view.IEnterpriseDistanceView;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.ReportRating;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.exception.ApplicationException;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.CollectionAssignmentRepository;
import com.example.suwmp_be.repository.EnterpriseRepository;
import com.example.suwmp_be.repository.ReportRatingRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.IWasteReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WasteReportServiceImpl implements IWasteReportService {
    private final WasteReportRepository wasteReportRepo;
    private final EnterpriseRepository enterpriseRepo;
    private final WasteReportMapper wasteReportMapper;
    private final ReportRatingRepository reportRatingRepo;
    private final CollectionAssignmentRepository collectionAssignmentRepo;

    @Override
    public long createNewReport(WasteReportRequest request) {
        WasteReport wasteReport = wasteReportMapper.toEntity(request);

        // Normalize and default status using enum
        String status = wasteReport.getStatus() != null ? wasteReport.getStatus().toString() : null;
        if (status == null) {
            wasteReport.setStatus(WasteReportStatus.PENDING);
        } else {
            wasteReport.setStatus(WasteReportStatus.from(status));
        }

        return wasteReportRepo.save(wasteReport).getId();
    }

    @Override
    public List<ICollectionRequestView> getWasteReportRequestsByEnterprise(Long enterpriseId) {
        if (!enterpriseRepo.existsById(enterpriseId)) {
            throw new NotFoundException(ErrorCode.ENTERPRISE_NOT_FOUND);
        }
        return wasteReportRepo.getRequestsByEnterprise(enterpriseId);
    }

    @Override
    public List<EnterpriseNearbyResponse> getEnterprisesNearbyCitizen(Double citizenLong, Double citizenLat, Long wasteTypeId) {
        List<IEnterpriseDistanceView> enterprisesFound = wasteReportRepo.getEnterprisesNearbyCitizen(
                citizenLong,
                citizenLat,
                wasteTypeId
        );

        return enterprisesFound.stream()
                .map(e -> {
                    int base = e.getBasePoint();
                    double multiplier = e.getQualityMultiplier() != null
                            ? e.getQualityMultiplier() : 1;

                    double rewardPoint = base * multiplier;
                    return new EnterpriseNearbyResponse(
                            e.getId(),
                            e.getName(),
                            e.getDescription(),
                            e.getRating(),
                            e.getPhotoUrl(),
                            e.getCreatedAt(),
                            e.getDistance(),
                            rewardPoint);
                }).toList();
    }

    @Override
    public long cancelWasteReport(Long wasteReportId, String note) {
        WasteReport wasteReport = wasteReportRepo.findById(wasteReportId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND));

        wasteReport.setStatus(WasteReportStatus.REJECTED);
        wasteReport.setEnterpriseNote(note);

        return wasteReportRepo.save(wasteReport).getId();
    }

    @Override
    public CitizenWasteReportStatusResponse getCitizenReportStatus(Long reportId, UUID citizenId) {
        WasteReport report = wasteReportRepo.findByIdAndCitizen_Id(reportId, citizenId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND));

        return toCitizenStatusResponse(report);
    }

    @Override
    public List<CitizenWasteReportStatusResponse> getCitizenReports(UUID citizenId) {
        List<WasteReport> reports = wasteReportRepo.findAllByCitizen_IdOrderByCreatedAtDesc(citizenId);
        List<Long> reportIds = reports.stream().map(WasteReport::getId).toList();

        Map<Long, String> collectorMap = collectionAssignmentRepo.findByWasteReportIdIn(reportIds)
                .stream()
                .collect(Collectors.toMap(
                        ca -> ca.getWasteReport().getId(),
                        ca -> ca.getCollector() != null ? ca.getCollector().getFullName() : "Unknown",
                        (existing, replacement) -> existing // Keep the first assignment found
                ));

        return reports.stream()
                .map(report -> toCitizenStatusResponse(report, collectorMap.get(report.getId())))
                .toList();
    }

    @Override
    @Transactional
    public void submitRating(Long reportId, UUID citizenId, RatingRequest ratingRequest) {
        WasteReport report = wasteReportRepo.findByIdAndCitizen_Id(reportId, citizenId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND));

        if (report.getStatus() != WasteReportStatus.COLLECTED) {
            throw new ApplicationException(ErrorCode.INVALID_REPORT_STATUS);
        }

        ReportRating rating = ReportRating.builder()
                .report(report)
                .citizen(report.getCitizen())
                .rating(ratingRequest.getRating())
                .build();

        try {
            reportRatingRepo.saveAndFlush(rating);
        } catch (DataIntegrityViolationException e) {
            String message = e.getMessage();
            if (message != null && message.contains("uk_report_rating_report_user")) {
                throw new ApplicationException(ErrorCode.ALREADY_RATED);
            }
            throw e;
        }
    }

    @Override
    public RatingStatusResponse getRatingStatus(Long reportId, UUID citizenId) {
        WasteReport report = wasteReportRepo.findByIdAndCitizen_Id(reportId, citizenId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND));

        Optional<ReportRating> userRating = reportRatingRepo.findByReportIdAndCitizenId(reportId, citizenId);
        
        Double average = reportRatingRepo.getAverageRatingByReportId(reportId);
        long count = reportRatingRepo.countByReportId(reportId);

        boolean alreadyRated = userRating.isPresent();
        boolean canRate = report.getStatus() == WasteReportStatus.COLLECTED 
                && !alreadyRated 
                && report.getCitizen().getId().equals(citizenId);

        return RatingStatusResponse.builder()
                .canRate(canRate)
                .alreadyRated(alreadyRated)
                .userRating(userRating.map(ReportRating::getRating).orElse(null))
                .averageRating(average != null ? average : 0.0)
                .totalRatings(count)
                .build();
    }

    private CitizenWasteReportStatusResponse toCitizenStatusResponse(WasteReport report) {
        String collectorName = collectionAssignmentRepo.findByWasteReportId(report.getId())
                .stream()
                .findFirst()
                .map(ca -> ca.getCollector() != null ? ca.getCollector().getFullName() : null)
                .orElse(null);

        return toCitizenStatusResponse(report, collectorName);
    }

    private CitizenWasteReportStatusResponse toCitizenStatusResponse(WasteReport report, String collectorName) {
        Enterprise enterprise = report.getEnterprise();
        String referenceCode = String.format("REQ-%03d", report.getId());

        return new CitizenWasteReportStatusResponse(
                report.getId(),
                referenceCode,
                report.getStatus().toString(),
                report.getCreatedAt(),
                report.getWasteType() != null ? report.getWasteType().getName() : null,
                enterprise != null ? enterprise.getName() : null,
                collectorName,
                report.getLatitude(),
                report.getLongitude(),
                report.getVolume(),
                report.getPhotoUrl(),
                report.getDescription()
        );
    }
}
