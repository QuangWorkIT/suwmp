package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetRequest;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetResponse;
import com.example.suwmp_be.entity.User;
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

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CitizenServiceImpl {
    final UserRepository userRepository;
    final WasteReportRepository wasteReportRepository;
    final RewardTransactionRepository rewardTransactionRepository;
    final ComplaintRepository complaintRepository;

    public CitizenProfileGetResponse getCitizenProfile(CitizenProfileGetRequest request) {
        User user = userRepository.findById(request.citizenId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        int reports = 0;
        double volume = 0;
        for (var wr : wasteReportRepository.findAllByCitizen_Id(request.citizenId())) {
            reports++;
            volume += wr.getVolume();
        }

        int points = 0;
        for (var rt : rewardTransactionRepository.findAllByCitizen_Id(request.citizenId()))
            points += rt.getPoints();

        int feedbacks = 0;
        for (var c : complaintRepository.findAllByCitizenId(request.citizenId()))
            feedbacks++;

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
}
