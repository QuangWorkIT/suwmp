package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.CollectionAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectionAssignmentRepository extends JpaRepository<CollectionAssignment, Long> {
    CollectionAssignment findByWasteReportId(Long wasteReportId);
}
