package com.example.suwmp_be.service;

import com.example.suwmp_be.constants.LeaderboardPeriod;
import com.example.suwmp_be.dto.leaderboard.PodiumDto;
import com.example.suwmp_be.dto.leaderboard.RankingDto;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ILeaderBoardService {
    List<PodiumDto> getPodium(LocalDate date, LeaderboardPeriod period);
    //MyLeaderBoardDto getMyStats(UUID me, LocalDate date);

    List<RankingDto> getRankings(
            LocalDate date,
            LeaderboardPeriod period,
            Pageable pageable,
            UUID me
    );

    int calculateStreak(UUID citizenId);
}
