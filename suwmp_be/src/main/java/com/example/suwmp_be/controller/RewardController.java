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
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
public class RewardController {

    private final RewardTransactionRepository repository;
    private final JwtUtil jwtUtil;

    @GetMapping("/rewards")
    public List<RewardHistoryDto> getMyRewards(Authentication authentication) {

        Object principal = authentication.getPrincipal();
        UUID userId;
        if (principal instanceof UUID) {
            userId = (UUID) principal;
        } else {
            userId = UUID.fromString(principal.toString());
        }

        return repository.findRewardTransaction(userId);
    }

}

