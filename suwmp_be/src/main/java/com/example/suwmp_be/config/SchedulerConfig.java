package com.example.suwmp_be.config;

import com.example.suwmp_be.serviceImpl.LeaderboardSnapshotService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class SchedulerConfig {

    private final LeaderboardSnapshotService leaderboardSnapshotService;

    @Scheduled(cron = "0 0 0 * * *")
    public void runDailyLeaderboard() {
        leaderboardSnapshotService.generateSnapshot(LocalDate.now());
    }
}
