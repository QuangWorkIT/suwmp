package com.example.suwmp_be.service;


import com.example.suwmp_be.dto.request.RewardTransactionRequest;

public interface IRewardTransactionService {
    Long createRewardTransaction(RewardTransactionRequest transactionDto);
}
