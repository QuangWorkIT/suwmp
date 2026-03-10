package com.example.suwmp_be.repository;

import com.example.suwmp_be.dto.enterprise_report.WasteDistribution;
import com.example.suwmp_be.entity.WasteReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EnterpriseReportRepository extends JpaRepository<WasteReport, Long> {

    @Query("""
        SELECT COUNT(w)
        FROM WasteReport w
        WHERE w.status = 'COLLECTED'
    """)
    Long getTotalCollections();

    @Query("""
        SELECT COALESCE(SUM(w.volume) / 1000.0,0)
        FROM WasteReport w
        WHERE w.status = 'COLLECTED'
    """)
    Double getTotalVolumeTons();

    @Query(value = """
        SELECT AVG(EXTRACT(EPOCH FROM (ca.start_collect_at - wr.created_at)) / 3600)
        FROM collection_assignments ca
        JOIN waste_reports wr ON wr.id = ca.waste_report_id
        WHERE ca.start_collect_at IS NOT NULL
    """, nativeQuery = true)
    Double getAverageResponseTime();

    @Query(value = """
        SELECT 
        ROUND(
            (1 - (COUNT(c.id)::decimal / NULLIF(COUNT(wr.id), 0))) * 100
        ,2)
        FROM waste_reports wr
        LEFT JOIN complaints c 
        ON wr.id = c.waste_report_id
    """, nativeQuery = true)
    Double getCitizenSatisfaction();

    @Query("""
            SELECT new com.example.suwmp_be.dto.enterprise_report.WasteDistribution(
                wt.name,
                COUNT(wr.id),
                0.0
            )
            FROM WasteReport wr
            JOIN wr.wasteType wt
            GROUP BY wt.name
            ORDER BY COUNT(wr.id) DESC
            """)
    List<WasteDistribution> getWasteDistribution();

    @Query("SELECT COUNT(wr.id) FROM WasteReport wr")
    Long getTotalWasteReports();

    @Query(value = """
        SELECT 
            TO_CHAR(DATE(ca.last_updated_at), 'YYYY-MM-DD') AS date, 
            COUNT(wr.id) AS total
        FROM waste_reports wr
        JOIN collection_assignments ca ON wr.id = ca.waste_report_id
        WHERE wr.status = 'COLLECTED'
        GROUP BY DATE(ca.last_updated_at)
        ORDER BY DATE(ca.last_updated_at) ASC
    """, nativeQuery = true)
    List<Object[]> getCollectionTrends();

    @Query(value = """
        SELECT
            COALESCE(u.full_name, 'Unassigned Test Collector') AS collectorName,
            MAX(sa.id) AS zone, 
            COUNT(wr.id) AS collections,
            COALESCE(AVG(EXTRACT(EPOCH FROM (ca.last_updated_at - wr.created_at)) / 3600.0), 2) AS avgHoursTaken,
            COALESCE(AVG(rr.rating), 4.5) AS rating
        FROM waste_reports wr

        JOIN collection_assignments ca ON wr.id = ca.waste_report_id
        JOIN users u ON ca.collector_id = u.id
        LEFT JOIN service_area sa ON wr.enterprise_id = sa.enterprise_id
        LEFT JOIN report_ratings rr ON rr.report_id = wr.id

        WHERE wr.status = 'COLLECTED' 
        GROUP BY u.full_name
        ORDER BY collections DESC
    """, nativeQuery = true)
    List<Object[]> getCollectorPerformance();
}
