package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.CollectionAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface CollectorDashboardRepository extends JpaRepository<CollectionAssignment, Long> {

    @Query(value = """
    SELECT 
        COUNT(ca.id) AS total_tasks,
        SUM(CASE WHEN wr.status = 'COLLECTED' THEN 1 ELSE 0 END) AS completed_tasks,
        COALESCE(AVG(EXTRACT(EPOCH FROM (ca.start_collect_at - ca.assigned_at)) / 60.0), 0) AS avg_response_time
    FROM collection_assignments ca
    JOIN waste_reports wr ON ca.waste_report_id = wr.id
    WHERE ca.collector_id = :collectorId
      AND (
          ca.assigned_at >= :startOfDay
          OR wr.status IN ('ASSIGNED', 'ON_THE_WAY')
      )
""", nativeQuery = true)
    Map<String, Object> getTodaySummaryStats(
            @Param("collectorId") UUID collectorId,
            @Param("startOfDay") java.time.LocalDate startOfDay
);

    @Query(value = """
        SELECT COALESCE(AVG(rr.rating), 0)
        FROM report_ratings rr
        JOIN waste_reports wr ON rr.report_id = wr.id
        JOIN collection_assignments ca ON wr.id = ca.waste_report_id
        WHERE ca.collector_id = :collectorId
    """, nativeQuery = true)
    Double getOverallAverageRating(@Param("collectorId") UUID collectorId);


    // --- 2. TASKS ---
    @Query(value = """
    SELECT 
        wr.id AS task_id,
        wt.name AS waste_type,
        wr.status AS status,
        wr.priority AS priority,
        u.full_name AS citizen_name,
        COALESCE(
            ST_DistanceSphere(
                ST_MakePoint(:currentLng, :currentLat), 
                ST_MakePoint(wr.longitude, wr.latitude)
            ) / 1000.0, 
        0.0) AS distance_km
    FROM collection_assignments ca
    JOIN waste_reports wr ON ca.waste_report_id = wr.id
    JOIN waste_types wt ON wr.waste_type_id = wt.id
    JOIN users u ON wr.citizen_id = u.id
    WHERE ca.collector_id = :collectorId
      AND (
          ca.assigned_at >= CURRENT_DATE
          OR wr.status IN ('ASSIGNED', 'ON_THE_WAY')
      )
    ORDER BY 
        CASE WHEN wr.priority = 'URGENT' THEN 1 ELSE 2 END,
        distance_km ASC,
        ca.assigned_at ASC
""", nativeQuery = true)
    List<Map<String, Object>> getTodayTasks(
            @Param("collectorId") UUID collectorId,
            @Param("currentLat") Double currentLat,
            @Param("currentLng") Double currentLng
    );


    // --- 3. FEEDBACK ---
    @Query(value = """
        SELECT 
            rr.id AS rating_id,
            u.full_name AS citizen_name,
            rr.rating AS rating,
            rr.created_at AS created_at,
            wt.name AS waste_type
        FROM report_ratings rr
        JOIN waste_reports wr ON rr.report_id = wr.id
        JOIN collection_assignments ca ON wr.id = ca.waste_report_id
        JOIN users u ON rr.citizen_id = u.id
        JOIN waste_types wt ON wr.waste_type_id = wt.id -- THÊM JOIN BẢNG WASTE_TYPES
        WHERE ca.collector_id = :collectorId
        ORDER BY rr.created_at DESC
        LIMIT 5
    """, nativeQuery = true)
    List<Map<String, Object>> getRecentFeedbacks(@Param("collectorId") UUID collectorId);
}
