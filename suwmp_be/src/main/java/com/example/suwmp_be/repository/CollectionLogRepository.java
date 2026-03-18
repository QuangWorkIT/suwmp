package com.example.suwmp_be.repository;

import com.example.suwmp_be.dto.view.ICollectionLogHistoryView;
import com.example.suwmp_be.entity.CollectionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CollectionLogRepository extends JpaRepository<CollectionLog, Long> {

    @Query("""
            SELECT cl.id AS id,
                   wr.id AS wasteReportId,
                   collector.id AS collectorId,
                   cl.photoUrl AS proofPhotoUrl,
                   cl.createdAt AS collectedTime,
                   wr.longitude AS wasteReportLongitude,
                   wr.latitude AS wasteReportLatitude,
                   wr.volume AS wasteReportWeight,
                   wr.status AS wasteReportStatus,
                   rt.points AS points,
                   wt.name AS wasteTypeName
            FROM CollectionLog cl
            JOIN cl.wasteReport wr
            JOIN wr.wasteType wt
            JOIN cl.collector collector
            LEFT JOIN RewardTransaction rt ON rt.wasteReport = wr
            WHERE collector.id = :collectorId
            ORDER BY cl.createdAt DESC
            """)
    Page<ICollectionLogHistoryView> findCollectionLogHistoryByCollectorId(Pageable pageable, @Param("collectorId") UUID collectorId);
}
