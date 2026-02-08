package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.entity.LeaderboardDaily;
import com.example.suwmp_be.repository.LeaderboardDailyRepository;
import com.example.suwmp_be.repository.RewardTransactionRepository;
import com.example.suwmp_be.repository.projection.CitizenPointSum;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardSnapshotService {

    private final LeaderboardDailyRepository leaderboardDailyRepository;
    private final RewardTransactionRepository rewardTransactionRepository;

    @Transactional
    public void generateSnapshot(LocalDate date) {

        // 1️⃣ Aggregate points
        List<CitizenPointSum> results =
                rewardTransactionRepository.sumPointsUntil(date);

        int rank = 1;
        long prevPoints = -1;
        int actualRank = 0;

        for (CitizenPointSum row : results) {

            if (row.getTotalPoints() != prevPoints) {
                actualRank = rank;
            }

            leaderboardDailyRepository.save(
                    new LeaderboardDaily(
                            null,
                            row.getCitizen(),
                            actualRank,
                            row.getTotalPoints(),
                            date
                    )
            );

            prevPoints = row.getTotalPoints();
            rank++;
        }
    }
}
