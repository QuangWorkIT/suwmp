package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.WasteReportStatus;
import com.example.suwmp_be.dto.mapper.WasteReportMapper;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.CitizenWasteReportStatusResponse;
import com.example.suwmp_be.dto.response.EnterpriseNearbyResponse;
import com.example.suwmp_be.dto.view.ICollectionRequestView;
import com.example.suwmp_be.dto.view.IEnterpriseDistanceView;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.repository.EnterpriseRepository;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.service.IWasteReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WasteReportServiceImpl implements IWasteReportService {
    private final WasteReportRepository wasteReportRepo;
    private final EnterpriseRepository enterpriseRepo;
    private final WasteReportMapper wasteReportMapper;

    @Override
    public long createNewReport(WasteReportRequest request) {
        WasteReport wasteReport = wasteReportMapper.toEntity(request);

        // Normalize and default status using enum
        String status = wasteReport.getStatus().toString();
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
        return wasteReportRepo.findAllByCitizen_IdOrderByCreatedAtDesc(citizenId)
                .stream()
                .map(this::toCitizenStatusResponse)
                .toList();
    }

    private CitizenWasteReportStatusResponse toCitizenStatusResponse(WasteReport report) {
        Enterprise enterprise = report.getEnterprise();
        String referenceCode = String.format("REQ-%03d", report.getId());

        // TODO: wire collector name from collection_assignments if needed
        String collectorName = null;

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
