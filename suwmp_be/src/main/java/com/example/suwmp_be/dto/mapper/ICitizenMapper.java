package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.citizen_profile.CitizenProfileUpdateRequest;
import com.example.suwmp_be.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ICitizenMapper {
    void toCitizen(@MappingTarget User citizen, CitizenProfileUpdateRequest request);
}
