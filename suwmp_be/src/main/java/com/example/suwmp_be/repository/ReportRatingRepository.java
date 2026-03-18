package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.ReportRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReportRatingRepository extends JpaRepository<ReportRating, Long> {
    
    boolean existsByReportIdAndCitizenId(Long reportId, UUID citizenId);
    
    Optional<ReportRating> findByReportIdAndCitizenId(Long reportId, UUID citizenId);

    @Query("SELECT COUNT(r) FROM ReportRating r WHERE r.report.id = :reportId")
    long countByReportId(@Param("reportId") Long reportId);

    @Query("SELECT AVG(r.rating) FROM ReportRating r WHERE r.report.id = :reportId")
    Double getAverageRatingByReportId(@Param("reportId") Long reportId);
}
