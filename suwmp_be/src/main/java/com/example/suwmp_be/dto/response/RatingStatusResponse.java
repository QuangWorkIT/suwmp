package com.example.suwmp_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingStatusResponse {
    private boolean canRate;
    private boolean alreadyRated;
    private Integer userRating;
    private double averageRating;
    private long totalRatings;
}
