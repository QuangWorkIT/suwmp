package com.example.suwmp_be.repository;

import com.example.suwmp_be.dto.history.ReportHistoryDto;
import com.example.suwmp_be.entity.RewardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ReportHistoryRepository extends JpaRepository<RewardTransaction, Long> {
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
    List<ReportHistoryDto> findRewardTransaction(UUID citizenId);
}
