package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.request.CreateCollectionAssignment;
import com.example.suwmp_be.entity.CollectionAssignment;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ICollectionAssignmentMapper {

    CollectionAssignment toEntity(CreateCollectionAssignment dto);
}
