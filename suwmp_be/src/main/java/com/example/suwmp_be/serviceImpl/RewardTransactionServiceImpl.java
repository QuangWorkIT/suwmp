package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.request.RewardTransactionRequest;
import com.example.suwmp_be.entity.RewardTransaction;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.RewardTransactionRepository;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.repository.WasteReportRepository;
import com.example.suwmp_be.service.IRewardTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RewardTransactionServiceImpl implements IRewardTransactionService {
    private final RewardTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WasteReportRepository wasteReportRepository;

    @Override
    public Long createRewardTransaction(RewardTransactionRequest transactionDto) {
        WasteReport report = wasteReportRepository.findByIdAndCitizen_Id(transactionDto.getWasteReportId(), transactionDto.getCitizenId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.WASTE_REPORT_NOT_FOUND));

        User citizen = userRepository.findById((transactionDto.getCitizenId()))
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));
        
        RewardTransaction transaction = RewardTransactionRequest.toEntity(
                citizen, report, transactionDto.getPoints(), transactionDto.getReason());

        return transactionRepository.save(transaction).getId();
    }
}
