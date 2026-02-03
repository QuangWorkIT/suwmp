package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.RewardRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RewardRuleRepository extends JpaRepository<RewardRule, Long> {
    boolean existsByEnterpriseIdAndWasteTypeId(long enterpriseId, long wasteTypeId);

    Optional<RewardRule> findByEnterpriseIdAndWasteTypeId(long enterpriseId, long wasteTypeId);
}
