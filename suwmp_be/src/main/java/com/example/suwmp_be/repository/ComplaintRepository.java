package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
}
