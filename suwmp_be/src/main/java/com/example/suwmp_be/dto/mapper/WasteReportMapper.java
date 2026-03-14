package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.waste_report_complaint.WasteReportCreateForComplaintRequest;
import com.example.suwmp_be.dto.waste_report_complaint.WasteReportDetailForComplaint;
import com.example.suwmp_be.entity.WasteReport;
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


    @Mapping(source = "citizen.id", target = "citizenId")
    @Mapping(source = "citizen.fullName", target = "citizenName")
    @Mapping(source = "wasteType.id", target = "wasteTypeId")
    @Mapping(source = "wasteType.name", target = "wasteTypeName")
    @Mapping(source = "enterprise.id", target = "enterpriseId")
    @Mapping(source = "enterprise.name", target = "previousEnterprise")
    WasteReportDetailForComplaint toWasteReportDetailForComplaint(WasteReport entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    WasteReport toWasteReportEntity(WasteReport request);
}
