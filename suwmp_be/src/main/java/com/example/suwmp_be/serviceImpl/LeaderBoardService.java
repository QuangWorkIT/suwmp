package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.leaderboard.MyLeaderBoardDto;
import com.example.suwmp_be.dto.leaderboard.PodiumDto;
import com.example.suwmp_be.dto.leaderboard.RankingDto;
import com.example.suwmp_be.entity.LeaderboardDaily;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.LeaderboardDailyRepository;
import com.example.suwmp_be.repository.projection.CitizenDateProjection;
import com.example.suwmp_be.service.ILeaderBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

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

    @Override
    public List<PodiumDto> getPodium(LocalDate date) {

        List<LeaderboardDaily> rows =
                leaderboardDailyRepository
                        .findTop3BySnapshotDateOrderByRank(date);

        List<UUID> citizenIds =
                rows.stream()
                        .map(ld -> ld.getCitizen().getId())
                        .toList();

        Map<UUID, Integer> streakMap =
                buildStreakMap(citizenIds, date);

        return rows.stream()
                .map(ld -> new PodiumDto(
                        ld.getRank(),
                        ld.getCitizen().getId(),
                        ld.getCitizen().getFullName(),
                        ld.getTotalPoints(),
                        streakMap.getOrDefault(
                                ld.getCitizen().getId(), 0)
                ))
                .toList();
    }


    @Override
    public List<RankingDto> getRankings(
            LocalDate date,
            Pageable pageable,
            UUID me
    ) {
        List<LeaderboardDaily> rows =
                leaderboardDailyRepository
                        .findBySnapshotDateOrderByRank(date, pageable);

        List<UUID> citizenIds =
                rows.stream()
                        .map(ld -> ld.getCitizen().getId())
                        .toList();

        boolean isMeInPage = citizenIds.contains(me);
        LeaderboardDaily myDaily = null;

        if (!isMeInPage && me != null) {
            Optional<LeaderboardDaily> myStatsOpt = leaderboardDailyRepository
                    .findByCitizen_IdAndSnapshotDate(me, date);

            if (myStatsOpt.isPresent()) {
                myDaily = myStatsOpt.get();
                citizenIds.add(me);
            }
        }

        Map<UUID, Integer> streakMap =
                buildStreakMap(citizenIds, date);

        List<RankingDto> result = new ArrayList<>(rows.stream()
                .map(ld -> new RankingDto(
                        ld.getRank(),
                        ld.getCitizen().getId(),
                        ld.getCitizen().getFullName(),
                        ld.getTotalPoints(),
                        streakMap.getOrDefault(ld.getCitizen().getId(), 0),
                        ld.getCitizen().getId().equals(me)
                ))
                .toList());

        if (myDaily != null) {
            result.add(new RankingDto(
                    myDaily.getRank(),
                    myDaily.getCitizen().getId(),
                    myDaily.getCitizen().getFullName(),
                    myDaily.getTotalPoints(),
                    streakMap.getOrDefault(me, 0),
                    true
            ));
        }

        return result;
    }


    public MyLeaderBoardDto getMyStats(UUID me, LocalDate date) {
        LeaderboardDaily ld =
                leaderboardDailyRepository
                        .findByCitizen_IdAndSnapshotDate(me, date)
                        .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_DATA));

        return new MyLeaderBoardDto(
                ld.getRank(),
                ld.getTotalPoints(),
                calculateStreak(me)
        );
    }

    private int calculateStreakFromDates(List<LocalDate> dates) {
        if (dates == null || dates.isEmpty()) return 0;

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

    private Map<UUID, List<LocalDate>> groupDatesByCitizen(
            List<CitizenDateProjection> rows
    ) {
        Map<UUID, List<LocalDate>> map = new HashMap<>();

        for (CitizenDateProjection row : rows) {
            map.computeIfAbsent(
                    row.getCitizenId(),
                    k -> new ArrayList<>()
            ).add(row.getSnapshotDate());
        }

        return map;
    }

    private Map<UUID, Integer> buildStreakMap(
            List<UUID> citizenIds,
            LocalDate date
    ) {
        List<CitizenDateProjection> rows =
                leaderboardDailyRepository
                        .findDatesForStreakBatch(citizenIds, date);

        Map<UUID, List<LocalDate>> grouped =
                groupDatesByCitizen(rows);

        Map<UUID, Integer> streakMap = new HashMap<>();

        for (var entry : grouped.entrySet()) {
            streakMap.put(
                    entry.getKey(),
                    calculateStreakFromDates(entry.getValue())
            );
        }

        return streakMap;
    }

}