package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.citizen_dashboard.CitizenWidgetDTO;
import com.example.suwmp_be.dto.citizen_dashboard.MonthlyProgressDTO;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetRequest;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetResponse;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileUpdateRequest;
import com.example.suwmp_be.dto.mapper.ICitizenMapper;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.exception.BadRequestException;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.*;
import com.example.suwmp_be.service.ICitizenDashboardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CitizenServiceImpl implements ICitizenDashboardService {
    final UserRepository userRepository;
    final WasteReportRepository wasteReportRepository;
    final RewardTransactionRepository rewardTransactionRepository;
    final ComplaintRepository complaintRepository;
    final CitizenDashboardRepository citizenDashboardRepository;

    final ICitizenMapper citizenMapper;

    public CitizenProfileGetResponse getCitizenProfile(CitizenProfileGetRequest request) {
        User user = userRepository.findById(request.citizenId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        long reports = wasteReportRepository.countByCitizen_Id(request.citizenId());
        double volume = wasteReportRepository.sumVolumeByCitizenId(request.citizenId());

        int points = rewardTransactionRepository.sumPointsByCitizenId(request.citizenId());

        long feedbacks = complaintRepository.countByCitizen_Id(request.citizenId());

        return new CitizenProfileGetResponse(
                user.getId(),
                user.getFullName(),
                user.getPhone(),
                user.getEmail(),
                user.getCreatedAt(),
                points,
                reports,
                volume,
                feedbacks
        );
    }

    @Override
    public CitizenWidgetDTO getTopWidgets(UUID userId) {
        return new CitizenWidgetDTO(
                citizenDashboardRepository.getTotalReports(userId),
                citizenDashboardRepository.getTotalRewardPoints(userId),
                Math.round(citizenDashboardRepository.getTotalVolume(userId) * 10.0) / 10.0,
                citizenDashboardRepository.getItemsRecycled(userId)
        );
    }

    @Override
    public MonthlyProgressDTO getMonthlyProgress(UUID userId) {
        double targetPlasticKg = 15.0;
        long targetReports = 10L;
        long targetPoints = 500L;

        return new MonthlyProgressDTO(
                Math.round(citizenDashboardRepository.getMonthlyPlasticRecycled(userId) * 10.0) / 10.0,
                targetPlasticKg,
                citizenDashboardRepository.getMonthlyReportsSubmitted(userId),
                targetReports,
                citizenDashboardRepository.getMonthlyPointsEarned(userId),
                targetPoints
        );
    }

    @Transactional
    public void updateCitizenProfile(UUID citizenId, CitizenProfileUpdateRequest request) {
        User user = userRepository.findById(citizenId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        if (userRepository.existsByEmailAndIdNot(request.email(), citizenId))
            throw new BadRequestException(ErrorCode.EMAIL_EXISTED);

        if (userRepository.existsByPhoneAndIdNot(request.phone(), citizenId))
            throw new BadRequestException(ErrorCode.PHONE_EXISTED);

        citizenMapper.toCitizen(user, request);
        userRepository.save(user);
        log.info("Update citizen profile successful: {}", citizenId);
    }
}
