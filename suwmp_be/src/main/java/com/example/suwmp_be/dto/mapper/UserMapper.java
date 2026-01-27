package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.response.UserResponse;
import com.example.suwmp_be.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "role", source = "role.name")

    UserResponse toResponse(User user);

    default Page<UserResponse> toPageResponse(Page<User> page) {
        return page.map(this::toResponse);
    }
}
