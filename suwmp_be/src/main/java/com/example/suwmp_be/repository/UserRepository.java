package com.example.suwmp_be.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.suwmp_be.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmail(String email);
}
