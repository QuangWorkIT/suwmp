package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.EnterpriseCollector;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnterpriseCollectorRepository extends JpaRepository<EnterpriseCollector, Long> {
    
    Page<EnterpriseCollector> findByEnterpriseId(Long enterpriseId, Pageable pageable);
    
    Optional<EnterpriseCollector> findByEnterpriseIdAndCollectorId(Long enterpriseId, UUID collectorId);
    
    boolean existsByEnterpriseIdAndCollectorId(Long enterpriseId, UUID collectorId);
}

