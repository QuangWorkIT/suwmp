package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WasteReportMapper {

    @Mapping(source = "citizenId", target = "citizen.id")
    @Mapping(source = "enterprisesId", target = "enterprise.id")
    @Mapping(source = "wasteTypeId", target = "wasteType.id")
    @Mapping(source = "aiSuggestedTypeId", target = "aiSuggestedType.id")
    WasteReport toEntity(WasteReportRequest request);
}
