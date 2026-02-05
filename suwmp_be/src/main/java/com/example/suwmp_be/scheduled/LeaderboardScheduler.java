package com.example.suwmp_be.scheduled;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeaderboardScheduler {
    private final JdbcTemplate jdbcTemplate;

    @Scheduled(cron = "0 0 0 * * *")
    public void generateDailyLeaderboard() {
        jdbcTemplate.update("""
            INSERT INTO leaderboard_daily (citizen_id, rank, total_points, snapshot_date)
            SELECT
                citizen_id,
                RANK() OVER (ORDER BY SUM(points) DESC),
                SUM(points),
                CURRENT_DATE
            FROM reward_transactions
            GROUP BY citizen_id
            ON CONFLICT (citizen_id, snapshot_date) DO NOTHING
        """);
    }
}
