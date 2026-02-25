package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.enterprise_capacity.CreateEnterpriseCapacityRequest;
import com.example.suwmp_be.dto.enterprise_capacity.GetCapacitiesResponse;
import com.example.suwmp_be.dto.enterprise_capacity.UpdateEnterpriseCapacityRequest;
import com.example.suwmp_be.entity.EnterpriseCapacity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IEnterpriseCapacityMapper {
    @Mapping(source = "enterpriseId", target = "enterprise.id")
    @Mapping(source = "wasteTypeId", target = "wasteType.id")
    EnterpriseCapacity toEnterpriseCapacity(CreateEnterpriseCapacityRequest request);

    void toEnterpriseCapacity(@MappingTarget EnterpriseCapacity capacity, UpdateEnterpriseCapacityRequest request);

    @Mapping(source = "wasteType.id", target = "wasteTypeId")
    @Mapping(source = "enterprise.id", target = "enterpriseId")
    GetCapacitiesResponse toGetCapacitiesResponse(EnterpriseCapacity capacity);
}
