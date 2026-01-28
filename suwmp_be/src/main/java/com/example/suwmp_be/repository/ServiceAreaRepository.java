package com.example.suwmp_be.repository;

import com.example.suwmp_be.entity.ServiceArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceAreaRepository extends JpaRepository<ServiceArea, Long> {
    List<ServiceArea> findByEnterpriseId(Long enterpriseId);
}

