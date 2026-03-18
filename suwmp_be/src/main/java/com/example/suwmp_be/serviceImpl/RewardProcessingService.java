package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.entity.LeaderboardDaily;
import com.example.suwmp_be.entity.RewardTransaction;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.entity.WasteReport;
import com.example.suwmp_be.repository.LeaderboardDailyRepository;
import com.example.suwmp_be.repository.RewardTransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RewardProcessingService {
    private final RewardTransactionRepository rewardTransactionRepository;
    private final LeaderboardDailyRepository leaderboardDailyRepository;

    @Transactional // This guarantees both tables update, or neither do if it crashes!
    public void awardPointsForCollection(WasteReport report, int pointsAwarded, String reason) {
        User citizen = report.getCitizen();

        // 1. Create the immutable Reward Transaction (The History)
        RewardTransaction transaction = new RewardTransaction();
        transaction.setCitizen(citizen);
        transaction.setWasteReport(report);
        transaction.setPoints(pointsAwarded);
        transaction.setReason(reason);
        rewardTransactionRepository.save(transaction);

        // 2. Calculate their absolute total points up to this exact second
        Integer calculatedSum = rewardTransactionRepository.sumPointsByCitizenId(citizen.getId());
        Long newTotalPoints = (calculatedSum != null) ? calculatedSum.longValue() : 0L;

        // 3. Upsert today's Leaderboard Record (The Snapshot)
        LocalDate today = LocalDate.now();
        Optional<LeaderboardDaily> todayLeaderboardOpt =
                leaderboardDailyRepository.findByCitizen_IdAndSnapshotDate(citizen.getId(), today);

        LeaderboardDaily dailyStats;
        if (todayLeaderboardOpt.isPresent()) {
            // Update existing record for today
            dailyStats = todayLeaderboardOpt.get();
            dailyStats.setTotalPoints(newTotalPoints);
        } else {
            // First time earning points today, create a new row!
            dailyStats = new LeaderboardDaily();
            dailyStats.setCitizen(citizen);
            dailyStats.setSnapshotDate(today);
            dailyStats.setTotalPoints(newTotalPoints);

            // We set rank to 0 or 9999 temporarily.
            // Ranks are usually recalculated by a background job later.
            dailyStats.setRank(0);
        }

        leaderboardDailyRepository.save(dailyStats);
    }
}
