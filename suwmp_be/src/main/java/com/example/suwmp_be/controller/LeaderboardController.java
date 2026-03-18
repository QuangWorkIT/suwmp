package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.leaderboard.MyLeaderBoardDto;
import com.example.suwmp_be.dto.leaderboard.PodiumDto;
import com.example.suwmp_be.dto.leaderboard.RankingDto;
import com.example.suwmp_be.service.ILeaderBoardService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    private final ILeaderBoardService leaderboardService;

    @GetMapping("/podium")
    public ResponseEntity<BaseResponse<List<PodiumDto>>> podium() {
        List<PodiumDto> podium = leaderboardService.getPodium(LocalDate.now());
        return ResponseEntity.ok(
                new BaseResponse<>(
                        true,
                        "Fetched podium successfully",
                        podium
                )
        );
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<RankingDto>>> rankings(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now()}") LocalDate date,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "5") @Min(1) int size,
            @AuthenticationPrincipal UUID userId
    ) {
        List<RankingDto> ranks = leaderboardService.getRankings(
                date,
                Pageable.ofSize(size).withPage(page),
                userId
        );

        return ResponseEntity.ok(
                new BaseResponse<>(
                        true,
                        "Fetched rankings successfully",
                        ranks
                )
        );
    }

//    @GetMapping("/me")
//    public ResponseEntity<BaseResponse<MyLeaderBoardDto>> me(
//            @AuthenticationPrincipal UUID userId
//    ) {
//        MyLeaderBoardDto myLeaderBoardDto = leaderboardService.getMyStats(
//                userId,
//                LocalDate.now()
//        );
//        return ResponseEntity.ok(
//                new BaseResponse<>(
//                        true,
//                        "Fetched my leaderboard stats successfully",
//                        myLeaderBoardDto
//                )
//        );
//    }
}
