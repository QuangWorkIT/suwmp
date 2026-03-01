package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.CollectionAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionAssignmentRepository extends JpaRepository<CollectionAssignment, Long> {
    List<CollectionAssignment> findByWasteReportIdIn(List<Long> wasteReportIds);
    List<CollectionAssignment> findByWasteReportId(Long wasteReportId);
}
