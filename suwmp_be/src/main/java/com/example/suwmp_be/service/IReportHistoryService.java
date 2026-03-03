package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.view.IReportHistoryView;

import java.util.List;
import java.util.UUID;

public interface IReportHistoryService {
    List<IReportHistoryView> getReportHistoryByCitizenId(UUID citizenId);
}
