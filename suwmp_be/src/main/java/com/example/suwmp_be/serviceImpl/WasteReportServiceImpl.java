package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.constants.ReportStatus;
import com.example.suwmp_be.dto.mapper.WasteReportMapper;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.CitizenWasteReportStatusResponse;
import com.example.suwmp_be.dto.view.CollectionRequestView;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.EnterpriseRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
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
        String status = wasteReport.getStatus();
        if (status == null) {
            wasteReport.setStatus(ReportStatus.PENDING.name());
        } else {
            wasteReport.setStatus(ReportStatus.from(status).name());
        }

        return wasteReportRepo.save(wasteReport).getId();
    }

    @Override
    public List<CollectionRequestView> getWasteReportRequestsByEnterprise(Long enterpriseId) {
        if (!enterpriseRepo.existsById(enterpriseId)) {
            throw new NotFoundException(ErrorCode.ENTERPRISE_NOT_FOUND);
        }
        return wasteReportRepo.getRequestsByEnterprise(enterpriseId);
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
                report.getStatus(),
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

