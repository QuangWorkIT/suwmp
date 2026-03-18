package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.enterprise_profile.EnterpriseGetResponse;
import com.example.suwmp_be.entity.Enterprise;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IEnterpriseMapper {
    EnterpriseGetResponse toEnterpriseGetResponse(Enterprise entity);
}
