package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.mapper.WasteReportMapper;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.view.CitizenReportView;
import com.example.suwmp_be.dto.view.CollectionRequestView;
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
    public List<CitizenReportView> getWasteReportsByCitizen(UUID citizenId) {
        return wasteReportRepo.getReportsByCitizen(citizenId);
    }
}
