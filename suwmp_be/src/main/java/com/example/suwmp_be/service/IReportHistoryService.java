package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.history.ReportHistoryDto;

import java.util.List;
import java.util.UUID;

public interface IReportHistoryService {
    List<ReportHistoryDto> getReportHistoryByCitizenId(UUID citizenId);
}
