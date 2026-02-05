package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.LeaderboardDaily;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LeaderboardDailyRepository extends JpaRepository<LeaderboardDaily, Long> {

    // Rankings by date
    List<LeaderboardDaily> findBySnapshotDateOrderByRank(
            LocalDate snapshotDate,
            Pageable pageable
    );

    // Get user's rank on a date
    Optional<LeaderboardDaily> findByCitizen_IdAndSnapshotDate(
            UUID citizenId,
            LocalDate snapshotDate
    );

    // Top 3
    List<LeaderboardDaily> findTop3BySnapshotDateOrderByRank(
            LocalDate snapshotDate
    );

    // Dates user appeared (for streak)
    @Query("""
        SELECT ld.snapshotDate
        FROM LeaderboardDaily ld
        WHERE ld.citizen.id = :citizenId
        ORDER BY ld.snapshotDate DESC
    """)
    List<LocalDate> findDatesForStreak(@Param("citizenId") UUID citizenId);
}
