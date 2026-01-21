package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Integer> {
}
