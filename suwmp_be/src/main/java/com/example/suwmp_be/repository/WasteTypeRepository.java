package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.WasteType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WasteTypeRepository extends JpaRepository<WasteType, Integer> {

    boolean existsByNameIgnoreCaseAndDeletedAtIsNull(String name);

    List<WasteType> findAllByDeletedAtIsNull();
}

