package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetRequest;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetResponse;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileUpdateRequest;
import com.example.suwmp_be.dto.mapper.ICitizenMapper;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.exception.BadRequestException;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.ComplaintRepository;
import com.example.suwmp_be.repository.RewardTransactionRepository;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CitizenServiceImpl {
    final UserRepository userRepository;
    final WasteReportRepository wasteReportRepository;
    final RewardTransactionRepository rewardTransactionRepository;
    final ComplaintRepository complaintRepository;

    final ICitizenMapper citizenMapper;

    public CitizenProfileGetResponse getCitizenProfile(CitizenProfileGetRequest request) {
        User user = userRepository.findById(request.citizenId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        long reports = wasteReportRepository.countByCitizen_Id(request.citizenId());
        double volume = wasteReportRepository.sumVolumeByCitizenId(request.citizenId());

        int points = rewardTransactionRepository.sumPointsByCitizenId(request.citizenId());

        long feedbacks = complaintRepository.countByCitizen_Id(request.citizenId());

        log.info("Get citizen profile successful: {}", request.citizenId());

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

    public void updateCitizenProfile(UUID citizenId, CitizenProfileUpdateRequest request) {
        User user = userRepository.findById(citizenId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        if (!request.email().equals(user.getEmail()) && userRepository.existsByEmail(request.email()))
            throw new BadRequestException(ErrorCode.EMAIL_EXISTED);

        if (!request.phone().equals(user.getPhone()) && userRepository.existsByPhone(request.phone()))
            throw new BadRequestException(ErrorCode.PHONE_EXISTED);

        citizenMapper.toCitizen(user, request);
        userRepository.save(user);
        log.info("Update citizen profile successful: {}", citizenId);
    }
}
