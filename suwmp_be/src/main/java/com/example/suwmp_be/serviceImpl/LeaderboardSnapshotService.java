package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.entity.LeaderboardDaily;
import com.example.suwmp_be.repository.LeaderboardDailyRepository;
import com.example.suwmp_be.repository.RewardTransactionRepository;
import com.example.suwmp_be.repository.projection.CitizenPointSum;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardSnapshotService {

    private final LeaderboardDailyRepository leaderboardDailyRepository;
    private final RewardTransactionRepository rewardTransactionRepository;

    @Transactional
    public void generateSnapshot(LocalDate date) {

        List<CitizenPointSum> results =
                rewardTransactionRepository.sumPointsUntil(date.atTime(23, 59, 59));

        List<LeaderboardDaily> newRows = new ArrayList<>();
        long prevPoints = -1;
        int actualRank = 1;

        for (int i = 0; i < results.size(); i++) {
            CitizenPointSum row = results.get(i);
            if (row.getTotalPoints() != prevPoints) {
                actualRank = i + 1;
            }
            newRows.add(new LeaderboardDaily(
                    null,
                    row.getCitizen(),
                    actualRank,
                    row.getTotalPoints(),
                    date
            ));
            prevPoints = row.getTotalPoints();
        }

        leaderboardDailyRepository.deleteBySnapshotDate(date);
        leaderboardDailyRepository.saveAll(newRows);
    }
}
