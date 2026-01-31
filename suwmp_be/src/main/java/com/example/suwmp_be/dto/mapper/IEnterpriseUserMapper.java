package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.enterprise_capacity.GetEnterpriseUserByUserIdResponse;
import com.example.suwmp_be.entity.EnterpriseUser;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IEnterpriseUserMapper {
    GetEnterpriseUserByUserIdResponse toGetEnterpriseUserByUserIdResponse(EnterpriseUser enterpriseUser);
}
