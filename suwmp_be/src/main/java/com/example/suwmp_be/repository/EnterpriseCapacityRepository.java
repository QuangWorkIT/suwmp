package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.EnterpriseCapacity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnterpriseCapacityRepository extends JpaRepository<EnterpriseCapacity, Long> {
    boolean existsByEnterpriseIdAndWasteTypeId(long enterpriseId, long wasteTypeId);
    Optional<EnterpriseCapacity> findByEnterpriseIdAndWasteTypeId(long enterpriseId, long wasteTypeId);

    @EntityGraph(attributePaths = {"enterprise", "wasteType"})
    Optional<List<EnterpriseCapacity>> findByEnterpriseId(Long enterpriseId);
}
