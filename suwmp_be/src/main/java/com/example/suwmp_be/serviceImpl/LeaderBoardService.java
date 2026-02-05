package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.leaderboard.MyLeaderBoardDto;
import com.example.suwmp_be.dto.leaderboard.PodiumDto;
import com.example.suwmp_be.dto.leaderboard.RankingDto;
import com.example.suwmp_be.entity.LeaderboardDaily;
import com.example.suwmp_be.repository.LeaderboardDailyRepository;
import com.example.suwmp_be.service.ILeaderBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeaderBoardService implements ILeaderBoardService {

    private final LeaderboardDailyRepository leaderboardDailyRepository;

    @Override
    public int calculateStreak(UUID citizenId) {
        List<LocalDate> dates =
                leaderboardDailyRepository.findDatesForStreak(citizenId);

        if (dates.isEmpty()) return 0;

        int streak = 1;
        LocalDate prev = dates.get(0);

        for (int i = 1; i < dates.size(); i++) {
            LocalDate current = dates.get(i);
            if (current.equals(prev.minusDays(1))) {
                streak++;
                prev = current;
            } else {
                break;
            }
        }
        return streak;
    }

    public List<PodiumDto> getPodium(LocalDate date) {
        return leaderboardDailyRepository
                .findTop3BySnapshotDateOrderByRank(date)
                .stream()
                .map(ld -> new PodiumDto(
                        ld.getRank(),
                        ld.getCitizen().getId(),
                        ld.getCitizen().getFullName(),
                        //ld.getCitizen().getArea(),
                        ld.getTotalPoints(),
                        calculateStreak(ld.getCitizen().getId())
                ))
                .toList();
    }

    public List<RankingDto> getRankings(
            LocalDate date,
            Pageable pageable,
            UUID me
    ) {
        return leaderboardDailyRepository
                .findBySnapshotDateOrderByRank(date, pageable)
                .stream()
                .map(ld -> new RankingDto(
                        ld.getRank(),
                        ld.getCitizen().getId(),
                        ld.getCitizen().getFullName(),
                        //ld.getCitizen().getArea(),
                        ld.getTotalPoints(),
                        calculateStreak(ld.getCitizen().getId()),
                        ld.getCitizen().getId().equals(me)
                ))
                .toList();
    }

    public MyLeaderBoardDto getMyStats(UUID me, LocalDate date) {
        LeaderboardDaily ld =
                leaderboardDailyRepository
                        .findByCitizen_IdAndSnapshotDate(me, date)
                        .orElseThrow();

        return new MyLeaderBoardDto(
                ld.getRank(),
                ld.getTotalPoints(),
                calculateStreak(me)
        );
    }
}