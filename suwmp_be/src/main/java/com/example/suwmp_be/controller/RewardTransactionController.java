package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.RewardTransactionRequest;
import com.example.suwmp_be.service.IRewardTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reward-transactions")
@RequiredArgsConstructor
public class RewardTransactionController {
    private final IRewardTransactionService transactionService;

    @PostMapping
    public ResponseEntity<BaseResponse<Long>> createRewardTransaction(
            @RequestBody @Valid RewardTransactionRequest request) {
        Long transactionId = transactionService.createRewardTransaction(request);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Reward transaction created successfully",
                transactionId
        ));
    }
}
