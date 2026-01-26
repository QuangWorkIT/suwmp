package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.mapper.WasteReportMapper;
import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.IWasteReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WasteReportServiceImpl implements IWasteReportService {
    private final WasteReportRepository wasteReportRepo;
    private final WasteReportMapper wasteReportMapper;

    @Override
    public long createNewReport(WasteReportRequest request) {
        WasteReport wasteReport = wasteReportMapper.toEntity(request);
        return wasteReportRepo.save(wasteReport).getId();
    }
}
