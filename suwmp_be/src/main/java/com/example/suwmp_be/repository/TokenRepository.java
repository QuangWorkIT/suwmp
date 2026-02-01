package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    Optional<Token> findTokenByTokenId(String tokenId);

    @Modifying
    @Query("DELETE FROM Token t WHERE t.tokenId = :tokenId")
    void deleteTokenByTokenId(@Param("tokenId") String tokenId);
}
