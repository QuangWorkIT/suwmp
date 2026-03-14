package com.example.suwmp_be.dto.collector_dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FeedbackDTO {
    private Long ratingId;
    private String citizenName;
    private String timeAgo;
    private int rating;
    private String comment;
}
