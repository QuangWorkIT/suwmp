package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.request.CreateUserRequest;
import com.example.suwmp_be.dto.request.UpdateUserRequest;
import com.example.suwmp_be.dto.response.UserResponse;
import com.example.suwmp_be.entity.User;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(target = "role", source = "role.name")
    UserResponse toResponse(User user);

    @Mapping(source = "roleId", target = "role.id")
    User toEntity(CreateUserRequest request);
    void updateEntity(UpdateUserRequest request, @MappingTarget User user);

    default Page<UserResponse> toPageResponse(Page<User> page) {
        return page.map(this::toResponse);
    }
}
