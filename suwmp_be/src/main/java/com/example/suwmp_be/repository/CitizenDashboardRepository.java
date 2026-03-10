package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.WasteReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface CitizenDashboardRepository extends JpaRepository<WasteReport, Long> {

    @Query(value = "SELECT COUNT(id) FROM waste_reports WHERE citizen_id = :userId", nativeQuery = true)
    Long getTotalReports(@Param("userId") UUID userId);

    @Query(value = "SELECT COALESCE(SUM(points), 0) FROM reward_transactions WHERE citizen_id = :userId", nativeQuery = true)
    Long getTotalRewardPoints(@Param("userId") UUID userId);

    @Query(value = """
        SELECT COALESCE(SUM(volume), 0) 
        FROM waste_reports 
        WHERE citizen_id = :userId AND status = 'COLLECTED'
    """, nativeQuery = true)
    Double getTotalVolume(@Param("userId") UUID userId);

    @Query(value = """
        SELECT COUNT(wr.id) 
        FROM waste_reports wr
        JOIN waste_types wt ON wr.waste_type_id = wt.id
        WHERE wr.citizen_id = :userId AND wr.status = 'COLLECTED' AND wt.name = 'RECYCLABLE'
    """, nativeQuery = true)
    Long getItemsRecycled(@Param("userId") UUID userId);

    @Query(value = """
        SELECT COALESCE(SUM(wr.volume), 0) 
        FROM waste_reports wr
        JOIN waste_types wt ON wr.waste_type_id = wt.id
        WHERE wr.citizen_id = :userId AND wr.status = 'COLLECTED' AND wt.name = 'RECYCLABLE'
          AND EXTRACT(MONTH FROM wr.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM wr.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    """, nativeQuery = true)
    Double getMonthlyPlasticRecycled(@Param("userId") UUID userId);

    @Query(value = """
        SELECT COUNT(id) 
        FROM waste_reports 
        WHERE citizen_id = :userId
          AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    """, nativeQuery = true)
    Long getMonthlyReportsSubmitted(@Param("userId") UUID userId);

    @Query(value = """
        SELECT COALESCE(SUM(points), 0) 
        FROM reward_transactions 
        WHERE citizen_id = :userId
          AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    """, nativeQuery = true)
    Long getMonthlyPointsEarned(@Param("userId") UUID userId);
}
