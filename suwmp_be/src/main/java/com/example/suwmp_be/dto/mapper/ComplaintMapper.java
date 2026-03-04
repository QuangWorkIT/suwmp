package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.complaint.ComplaintDTO;
import com.example.suwmp_be.dto.response.ComplaintResponse;
import com.example.suwmp_be.entity.Complaint;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ComplaintMapper {

    @Mapping(target = "citizenName", source = "citizen.fullName")
    @Mapping(target = "status", source = "status")
    ComplaintResponse toResponse(Complaint complaint);

    Complaint toEntity(ComplaintResponse complaintResponse);

    @Mapping(target = "citizenName", source = "citizen.fullName")
    ComplaintDTO toDTO(Complaint complaint);

    default Page<ComplaintResponse> toPageResponse(Page<Complaint> page) {
        return page.map(this::toResponse);
    }
}
