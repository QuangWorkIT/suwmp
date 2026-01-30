package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.EnterpriseUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EnterpriseUserRepository extends JpaRepository<EnterpriseUser, Long> {
    boolean existsByEnterpriseIdAndUserId(Long enterpriseId, UUID userId);
}

