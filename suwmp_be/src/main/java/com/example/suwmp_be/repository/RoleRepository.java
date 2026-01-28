package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
