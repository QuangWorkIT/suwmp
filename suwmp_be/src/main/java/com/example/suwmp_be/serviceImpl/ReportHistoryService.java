package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.history.ReportHistoryDto;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.IReportHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportHistoryService implements IReportHistoryService {
    private final WasteReportRepository wasteReportRepository;

    @Override
    public List<ReportHistoryDto> getReportHistoryByCitizenId(UUID citizenId) {
        return wasteReportRepository.findReportHistoryByCitizenId(citizenId);
    }
}
