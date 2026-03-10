package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetRequest;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetResponse;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileUpdateRequest;
import com.example.suwmp_be.serviceImpl.CitizenServiceImpl;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/citizens")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CitizenController {
    final CitizenServiceImpl citizenService;

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/profile/{citizenId}")
    public ResponseEntity<BaseResponse<CitizenProfileGetResponse>> getCitizenProfile(@PathVariable UUID citizenId) {
        CitizenProfileGetResponse response = citizenService.getCitizenProfile(new CitizenProfileGetRequest(citizenId));

        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(
                        true,
                        "Get citizen profile successfully",
                        response
                ));
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @PutMapping("/profile/{citizenId}")
    public ResponseEntity<BaseResponse<?>> updateCitizenProfile(@PathVariable UUID citizenId, @Valid @RequestBody CitizenProfileUpdateRequest request) {
        citizenService.updateCitizenProfile(citizenId, request);

        return ResponseEntity.status(HttpStatus.OK)
                .body(new BaseResponse<>(
                        true,
                        "Update citizen profile successfully"
                ));
    }
}
