package com.example.suwmp_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class EnterpriseNearbyResponse {
    private Long id;
    private String name;
    private String description;
    private Float rating;
    private String photoUrl;
    private LocalDateTime createdAt;
    private Double distance;
    private Double rewardPoints;
}
