package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetRequest;
import com.example.suwmp_be.dto.citizen_profile.CitizenProfileGetResponse;
import com.example.suwmp_be.serviceImpl.CitizenServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/citizens")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CitizenController {
    final CitizenServiceImpl citizenService;

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
}
