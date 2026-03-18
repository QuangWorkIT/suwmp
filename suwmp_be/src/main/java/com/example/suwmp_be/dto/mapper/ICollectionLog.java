package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.request.CreateCollectionLogRequest;
import com.example.suwmp_be.entity.CollectionLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ICollectionLog {

    @Mapping(source = "wasteReportId", target = "wasteReport.id")
    @Mapping(source = "collectionAssignmentId", target = "collectionAssignment.id")
    @Mapping(source = "collectorId", target = "collector.id")
    CollectionLog toEntity(CreateCollectionLogRequest request);
}
