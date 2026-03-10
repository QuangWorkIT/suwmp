package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.citizen_dashboard.CitizenWidgetDTO;
import com.example.suwmp_be.dto.citizen_dashboard.MonthlyProgressDTO;

import java.util.UUID;

public interface ICitizenDashboardService {
    CitizenWidgetDTO getTopWidgets(UUID userId);

    MonthlyProgressDTO getMonthlyProgress(UUID userId);
}
