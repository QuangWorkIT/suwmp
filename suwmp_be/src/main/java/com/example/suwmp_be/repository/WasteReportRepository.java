package com.example.suwmp_be.repository;

import com.example.suwmp_be.dto.view.IAssignedTaskView;
import com.example.suwmp_be.dto.view.ICollectionRequestView;
import com.example.suwmp_be.dto.view.IEnterpriseDistanceView;
import com.example.suwmp_be.dto.view.IReportHistoryView;
import com.example.suwmp_be.entity.WasteReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WasteReportRepository extends JpaRepository<WasteReport, Long> {

    @Query(value = """
            SELECT
                wr.id                     AS requestId,
                wr.enterprise_id          AS enterpriseId,
                wt.name                   AS wasteTypeName,
                wr.longitude              AS requestLongitude,
                wr.latitude               AS requestLatitude,
                wr.volume                 AS volume,
                wr.priority               AS priority,
                wr.status                 AS currentStatus,
                u1.full_name              AS citizenName,
                u1.phone                  AS citizenPhone,
                u2.full_name              AS collectorName,
                wr.created_at             AS createdAt
            FROM waste_reports wr
            JOIN waste_types wt
                ON wt.id = wr.waste_type_id
            JOIN users u1
                ON u1.id = wr.citizen_id
            LEFT JOIN collection_assignments ca
                ON ca.waste_report_id = wr.id
            LEFT JOIN users u2
                ON u2.id = ca.collector_id
            WHERE u1.deleted_at IS NULL
              AND wr.enterprise_id = :enterpriseId
            ORDER BY wr.created_at DESC
            """, nativeQuery = true)
    Page<ICollectionRequestView> getRequestsByEnterprise(Long enterpriseId, Pageable pageable);

    @Query(value = """
                SELECT
                    e.id,e.name,e.description,e.rating,e.photo_url AS photoUrl,e.created_at AS createdAt,
            
                    rr.base_points AS basePoint,
                    rr.quality_multiplier AS qualityMultiplier,
            
                    ST_Distance(
                        ST_MakePoint(sa.longitude, sa.latitude)::geography,
                        ST_MakePoint(:citizenLong, :citizenLat)::geography
                    ) / 1000 AS distance
            
                FROM enterprises e
                JOIN service_area sa ON sa.enterprise_id = e.id
                JOIN reward_rules rr
                    ON rr.enterprise_id = e.id
                    AND rr.waste_type_id = :wasteTypeId
                    AND rr.active = true
            
                WHERE ST_DWithin(
                    ST_MakePoint(sa.longitude, sa.latitude)::geography,
                    ST_MakePoint(:citizenLong, :citizenLat)::geography,
                    sa.radius
                )
                ORDER BY distance
            """, nativeQuery = true)
    List<IEnterpriseDistanceView> getEnterprisesNearbyCitizen(
            @Param("citizenLong") Double citizenLong,
            @Param("citizenLat") Double citizenLat,
            @Param("wasteTypeId") Long wasteTypeId
    );

    Optional<WasteReport> findByIdAndCitizen_Id(Long id, UUID citizenId);

    List<WasteReport> findAllByCitizen_IdOrderByCreatedAtDesc(UUID citizenId);

    @Query("""
            SELECT
                wr.id               AS requestId,
                wt.name             AS wasteTypeName,
                wr.longitude        AS requestLongitude,
                wr.latitude         AS requestLatitude,
                wr.volume           AS volume,
                wr.priority         AS priority,
                wr.status           AS currentStatus,
                wr.photoUrl         AS photoUrl,
                citizen.fullName    AS citizenName,
                citizen.phone       AS citizenPhone,
                collector.id        AS collectorId,
                ca.startCollectAt   AS collectTime
            FROM CollectionAssignment ca
            JOIN ca.wasteReport wr
            JOIN wr.wasteType wt
            JOIN wr.citizen citizen
            JOIN ca.collector collector
            WHERE collector.id = :collectorId
            ORDER BY ca.startCollectAt ASC
            """)
    Page<IAssignedTaskView> findAssignedTasksByCollector_Id(UUID collectorId, Pageable pageable);

    @Query(value = """
        SELECT 
            wr.id AS id,
            wr.status AS status,
            COALESCE(wr.volume, 0) AS volume,
            COALESCE(wr.latitude, 0) AS latitude,
            COALESCE(wr.longitude, 0) AS longitude,
            wr.photo_url AS photoUrl,
            wr.created_at AS createdAt,
            wt.name AS wasteTypeName,
            COALESCE(rt.points, 0) AS rewardPoints
        FROM waste_reports wr
        JOIN waste_types wt ON wr.waste_type_id = wt.id
        LEFT JOIN reward_transactions rt 
               ON rt.waste_report_id = wr.id
        WHERE wr.citizen_id = :citizenId
        ORDER BY wr.created_at DESC
        """,
            nativeQuery = true)
    List<IReportHistoryView> findReportHistoryByCitizenId(
            @Param("citizenId") UUID citizenId
    );

    long countByCitizen_Id(UUID citizenId);

    @Query("""
    SELECT COALESCE(SUM(wr.volume),0)
    FROM WasteReport wr
    WHERE wr.citizen.id = :citizenId
""")
    Double sumVolumeByCitizenId(@Param("citizenId") UUID citizenId);
}
