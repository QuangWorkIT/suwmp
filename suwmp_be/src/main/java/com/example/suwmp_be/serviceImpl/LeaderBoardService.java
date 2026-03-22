package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.constants.LeaderboardPeriod;
import com.example.suwmp_be.dto.leaderboard.MyLeaderBoardDto;
import com.example.suwmp_be.dto.leaderboard.PodiumDto;
import com.example.suwmp_be.dto.leaderboard.RankingDto;
import com.example.suwmp_be.entity.LeaderboardDaily;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.LeaderboardDailyRepository;
import com.example.suwmp_be.repository.RewardTransactionRepository;
import com.example.suwmp_be.repository.projection.CitizenDateProjection;
import com.example.suwmp_be.repository.projection.CitizenPointSum;
import com.example.suwmp_be.service.ILeaderBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LeaderBoardService implements ILeaderBoardService {

    private final LeaderboardDailyRepository leaderboardDailyRepository;
    private final RewardTransactionRepository rewardTransactionRepository;

    private static final LocalDateTime MIN_DATE = LocalDateTime.of(2000, 1, 1, 0, 0);

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
    public List<PodiumDto> getPodium(LocalDate date, LeaderboardPeriod period) {
        if (period == LeaderboardPeriod.DAILY) {
            List<LeaderboardDaily> rows =
                    leaderboardDailyRepository
                            .findTop3BySnapshotDateOrderByRank(date);

            if (rows.isEmpty()) {
                // Fallback to latest snapshot date
                Optional<LocalDate> latestDateOpt = leaderboardDailyRepository.findLatestSnapshotDate();
                if (latestDateOpt.isPresent() && !latestDateOpt.get().equals(date)) {
                    date = latestDateOpt.get();
                    rows = leaderboardDailyRepository.findTop3BySnapshotDateOrderByRank(date);
                }
            }

            final LocalDate finalDate = date; // for closure
            List<UUID> citizenIds =
                    rows.stream()
                            .map(ld -> ld.getCitizen().getId())
                            .toList();

            Map<UUID, Integer> streakMap =
                    buildStreakMap(citizenIds, finalDate);

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

        LocalDateTime start = getStartTime(date, period);
        LocalDateTime end = date.atTime(23, 59, 59);

        List<CitizenPointSum> results = rewardTransactionRepository.sumPointsBetween(start, end);

        List<CitizenPointSum> top3 = results.stream().limit(3).toList();
        List<UUID> citizenIds = top3.stream().map(r -> r.getCitizen().getId()).toList();
        Map<UUID, Integer> streakMap = buildStreakMap(citizenIds, date);

        long prevPoints = -1;
        int actualRank = 1;
        List<PodiumDto> podium = new ArrayList<>();

        for (int i = 0; i < top3.size(); i++) {
            CitizenPointSum row = top3.get(i);
            if (row.getTotalPoints() != prevPoints) {
                actualRank = i + 1;
            }
            podium.add(new PodiumDto(
                    actualRank,
                    row.getCitizen().getId(),
                    row.getCitizen().getFullName(),
                    row.getTotalPoints(),
                    streakMap.getOrDefault(row.getCitizen().getId(), 0)
            ));
            prevPoints = row.getTotalPoints();
        }
        return podium;
    }

    @Override
    public List<RankingDto> getRankings(
            LocalDate date,
            LeaderboardPeriod period,
            Pageable pageable,
            UUID me
    ) {
        if (period == LeaderboardPeriod.DAILY) {
            List<LeaderboardDaily> rows =
                    leaderboardDailyRepository
                            .findBySnapshotDateOrderByRank(date, pageable);

            if (rows.isEmpty() && pageable.getPageNumber() == 0) {
                // Fallback to latest snapshot date
                Optional<LocalDate> latestDateOpt = leaderboardDailyRepository.findLatestSnapshotDate();
                if (latestDateOpt.isPresent() && !latestDateOpt.get().equals(date)) {
                    date = latestDateOpt.get();
                    rows = leaderboardDailyRepository.findBySnapshotDateOrderByRank(date, pageable);
                }
            }

            final LocalDate finalDate = date; // for closure
            List<UUID> citizenIds =
                    rows.stream()
                            .map(ld -> ld.getCitizen().getId())
                            .toList();

            boolean isMeInPage = citizenIds.contains(me);
            LeaderboardDaily myDaily = null;

            if (!isMeInPage && me != null) {
                Optional<LeaderboardDaily> myStatsOpt = leaderboardDailyRepository
                        .findByCitizen_IdAndSnapshotDate(me, finalDate);

                if (myStatsOpt.isPresent()) {
                    myDaily = myStatsOpt.get();
                    citizenIds.add(me);
                }
            }

            Map<UUID, Integer> streakMap =
                    buildStreakMap(citizenIds, finalDate);

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

        // For non-daily
        LocalDateTime start = getStartTime(date, period);
        LocalDateTime end = date.atTime(23, 59, 59);

        List<CitizenPointSum> allResults = rewardTransactionRepository.sumPointsBetween(start, end);

        int startIdx = (int) pageable.getOffset();
        int endIdx = Math.min(startIdx + pageable.getPageSize(), allResults.size());

        List<CitizenPointSum> pageResults = (startIdx < allResults.size())
                ? allResults.subList(startIdx, endIdx)
                : Collections.emptyList();

        List<UUID> idsInView = new ArrayList<>(pageResults.stream().map(r -> r.getCitizen().getId()).toList());

        CitizenPointSum mySumRow = null;
        int myRank = -1;

        if (me != null) {
            for (int i = 0; i < allResults.size(); i++) {
                if (allResults.get(i).getCitizen().getId().equals(me)) {
                    myRank = findActualRank(allResults, i);
                    if (i < startIdx || i >= endIdx) {
                        mySumRow = allResults.get(i);
                        idsInView.add(me);
                    }
                    break;
                }
            }
        }

        Map<UUID, Integer> streakMap = buildStreakMap(idsInView, date);
        List<RankingDto> finalResults = new ArrayList<>();

        for (int i = 0; i < pageResults.size(); i++) {
            int actualIdx = startIdx + i;
            int rank = findActualRank(allResults, actualIdx);
            CitizenPointSum row = pageResults.get(i);
            finalResults.add(new RankingDto(
                    rank,
                    row.getCitizen().getId(),
                    row.getCitizen().getFullName(),
                    row.getTotalPoints(),
                    streakMap.getOrDefault(row.getCitizen().getId(), 0),
                    row.getCitizen().getId().equals(me)
            ));
        }

        if (mySumRow != null) {
            finalResults.add(new RankingDto(
                    myRank,
                    mySumRow.getCitizen().getId(),
                    mySumRow.getCitizen().getFullName(),
                    mySumRow.getTotalPoints(),
                    streakMap.getOrDefault(me, 0),
                    true
            ));
        }

        return finalResults;
    }

    private int findActualRank(List<CitizenPointSum> results, int index) {
        int rank = index + 1;
        long targetPoints = results.get(index).getTotalPoints();
        for (int i = index - 1; i >= 0; i--) {
            if (results.get(i).getTotalPoints() == targetPoints) {
                rank = i + 1;
            } else {
                break;
            }
        }
        return rank;
    }

    private LocalDateTime getStartTime(LocalDate date, LeaderboardPeriod period) {
        return switch (period) {
            case WEEKLY -> date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();
            case MONTHLY -> date.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
            case ALL_TIME -> MIN_DATE;
            default -> date.atStartOfDay();
        };
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