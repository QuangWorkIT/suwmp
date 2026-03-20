package com.example.suwmp_be.repository;

import com.example.suwmp_be.dto.history.RewardHistoryDto;
import com.example.suwmp_be.entity.RewardTransaction;
import com.example.suwmp_be.repository.projection.CitizenPointSum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, Long> {
    Optional<RewardTransaction> findByWasteReportId(Long wasteReportId);

    @Query("""
        SELECT new com.example.suwmp_be.dto.history.RewardHistoryDto(
            rt.id,
            rt.points,
            rt.reason,
            rt.createdAt,
            wt.name,
            wr.longitude,
            wr.latitude,
            wr.volume,
            wr.status
            )
            FROM RewardTransaction rt
            JOIN rt.wasteReport wr
            JOIN wr.wasteType wt
            WHERE rt.citizen.id = :citizenId
            ORDER BY rt.createdAt DESC
        """)
    List<RewardHistoryDto> findRewardTransaction(UUID citizenId);

    @Query("""
        select
            rt.citizen as citizen,
            sum(rt.points) as totalPoints
        from RewardTransaction rt
        where rt.createdAt <= :date
        group by rt.citizen
        order by sum(rt.points) desc
    """)
    List<CitizenPointSum> sumPointsUntil(
            @Param("date") LocalDate date
    );

    @Query("""
        SELECT COALESCE(SUM(rt.points),0)
        FROM RewardTransaction rt
        WHERE rt.citizen.id = :citizenId
    """)
    Integer sumPointsByCitizenId(@Param("citizenId") UUID citizenId);
}
