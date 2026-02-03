package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.history.RewardTransactionDto;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.repository.RewardTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/citizen/rewards")
@RequiredArgsConstructor
public class RewardController {
    private final RewardTransactionRepository repository;

    @GetMapping
    public List<RewardTransactionDto> getMyRewards(
            @AuthenticationPrincipal User user
    ) {
        return repository
                .findByCitizenId(user.getId())
                .stream()
                .map(RewardTransactionDto::from)
                .toList();
    }
}
