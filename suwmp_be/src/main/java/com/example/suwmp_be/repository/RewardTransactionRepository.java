package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.RewardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, Long> {
    List<RewardTransaction> findByCitizenId(UUID citizenId);
}
