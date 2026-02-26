package com.example.suwmp_be.repository;

import com.example.suwmp_be.dto.view.CollectionRequestView;
import com.example.suwmp_be.entity.WasteReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WasteReportRepository extends JpaRepository<WasteReport, Long> {

    @Query(value = """
        SELECT
            wr.id                     AS requestId,
            wr.enterprise_id          AS enterpriseId,
            wt.name                   AS wasteTypeName,
            wr.longitude              AS requestLongitude,
            wr.latitude               AS requestLatitude,
            wr.volume                 AS volume,
            wr.status                 AS currentStatus,
            u1.full_name              AS citizenName,
            u1.phone                  AS citizenPhone,
            u2.full_name              AS collectorName,
            wr.created_at             AS createAt
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
          AND ca.enterprise_id = :enterpriseId
        ORDER BY wr.created_at DESC
        """, nativeQuery = true)
    List<CollectionRequestView> getRequestsByEnterprise(Long enterpriseId);
}
