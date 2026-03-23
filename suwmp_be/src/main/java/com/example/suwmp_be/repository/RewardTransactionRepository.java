package com.example.suwmp_be.repository;

import com.example.suwmp_be.dto.history.RewardHistoryDto;
import com.example.suwmp_be.entity.RewardTransaction;
import com.example.suwmp_be.repository.projection.CitizenPointSum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, Long> {
    List<RewardTransaction> findByWasteReport_Id(Long wasteReportId);

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
        where rt.createdAt <= :endOfDay
        group by rt.citizen
        order by sum(rt.points) desc
    """)
    List<CitizenPointSum> sumPointsUntil(
            @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query("""
        select
            rt.citizen as citizen,
            sum(rt.points) as totalPoints
        from RewardTransaction rt
        where rt.createdAt between :start and :end
        group by rt.citizen
        order by sum(rt.points) desc
    """)
    List<CitizenPointSum> sumPointsBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT COALESCE(SUM(rt.points),0)
        FROM RewardTransaction rt
        WHERE rt.citizen.id = :citizenId
    """)
    Integer sumPointsByCitizenId(@Param("citizenId") UUID citizenId);
}
