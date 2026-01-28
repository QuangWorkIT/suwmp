package com.example.suwmp_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceAreaResponse {
    private Long id;
    private Long enterpriseId;
    private Double latitude;
    private Double longitude;
    private Long radius;
}

