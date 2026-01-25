package com.example.suwmp_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectorResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private String status;
    private String imageUrl;
    private Instant createdAt;
}

