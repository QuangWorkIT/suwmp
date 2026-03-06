package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.OptionalInt;
import java.util.OptionalLong;
import java.util.UUID;

import java.util.UUID;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    @Query("""
    SELECT c FROM Complaint c
    ORDER BY 
        CASE c.status
            WHEN 'OPEN' THEN 1
            WHEN 'IN_PROGRESS' THEN 2
            WHEN 'RESOLVED' THEN 3
        END,
        c.createdAt ASC
""")
    Page<Complaint> findAllOrderByCustomStatus(Pageable pageable);

    Page<Complaint> findAllByCitizenId(UUID userId, Pageable pageable);

    long countByCitizen_Id(UUID citizenId);
}
