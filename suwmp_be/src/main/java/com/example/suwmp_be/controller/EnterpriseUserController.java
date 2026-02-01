package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.enterprise_capacity.GetEnterpriseUserByUserIdResponse;
import com.example.suwmp_be.serviceImpl.EnterpriseUserServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/enterprise-users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EnterpriseUserController {
    EnterpriseUserServiceImpl enterpriseUserService;

    @GetMapping("/get-by-userId/{userId}")
    public ResponseEntity<BaseResponse<GetEnterpriseUserByUserIdResponse>> getEnterpriseUserByUserIdResponse(
            @PathVariable UUID userId) {
        var responseBody = enterpriseUserService.getEnterpriseUserByUserIdResponse(userId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Get enterprise user successful",
                responseBody)
        );
    }
}
