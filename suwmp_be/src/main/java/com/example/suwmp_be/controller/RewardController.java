package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.history.RewardHistoryDto;
import com.example.suwmp_be.repository.RewardTransactionRepository;
import com.example.suwmp_be.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/citizen/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardTransactionRepository repository;
    private final JwtUtil jwtUtil;

    @GetMapping("/rewards")
    public List<RewardHistoryDto> getMyRewards(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getPrincipal().toString());
        return repository.findRewardTransaction(userId);
    }

}

