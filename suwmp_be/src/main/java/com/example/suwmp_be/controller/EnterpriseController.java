package com.example.suwmp_be.controller;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.enterprise_profile.EnterpriseGetResponse;
import com.example.suwmp_be.dto.enterprise_profile.EnterpriseUpdateProfileRequest;
import com.example.suwmp_be.exception.ForbiddenException;
import com.example.suwmp_be.serviceImpl.EnterpriseServiceImpl;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/enterprises")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnterpriseController {
    final EnterpriseServiceImpl enterpriseService;

    @PreAuthorize("hasRole('ENTERPRISE')")
    @GetMapping("/{enterpriseUserId}/profile")
    public ResponseEntity<BaseResponse<EnterpriseGetResponse>> getEnterpriseProfile(@PathVariable UUID enterpriseUserId, Authentication authentication) {
        UUID authenticatedUserId = (UUID) authentication.getPrincipal();
        if (!Objects.equals(authenticatedUserId, enterpriseUserId))
            throw new ForbiddenException(ErrorCode.UNAUTHORIZED);

        var response = enterpriseService.getByEnterpriseUserId(enterpriseUserId);

        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Get enterprise profile successfully",
                response
        ));
    }

    @PreAuthorize("hasRole('ENTERPRISE')")
    @PutMapping("/{enterpriseId}/{enterpriseUserId}/profile")
    public ResponseEntity<BaseResponse<?>> updateEnterpriseProfile(@PathVariable Long enterpriseId, @PathVariable UUID enterpriseUserId, @RequestBody @Valid EnterpriseUpdateProfileRequest request, Authentication authentication) {
        UUID authenticatedUserId = (UUID) authentication.getPrincipal();
        if (!Objects.equals(authenticatedUserId, enterpriseUserId))
            throw new ForbiddenException(ErrorCode.UNAUTHORIZED);

        enterpriseService.updateEnterpriseProfile(enterpriseId, request);

        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Update enterprise profile successfully"
        ));
    }
}
