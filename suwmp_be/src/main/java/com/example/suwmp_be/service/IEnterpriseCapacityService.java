package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.enterprise_capacity.*;

import java.util.List;
import java.util.UUID;

public interface IEnterpriseCapacityService {
    void createEnterpriseCapacity(CreateEnterpriseCapacityRequest request);

    void updateEnterpriseCapacity(long id, UpdateEnterpriseCapacityRequest request);

    List<GetCapacitiesResponse> getCapacities(long enterpriseId);

    void deleteCapacity(long id);
}
