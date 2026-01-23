package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer>
{
    Optional<Token> findTokenByTokenId(String tokenId);
    void deleteTokenByTokenId(String tokenId);
}
