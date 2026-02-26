package com.example.suwmp_be.dto.view;

import java.time.LocalDateTime;

public interface IEnterpriseDistanceView {
    Long getId();
    String getName();
    String getDescription();
    Float getRating();
    String getPhotoUrl();
    LocalDateTime getCreatedAt();

    Integer getBasePoint();
    Double getQualityMultiplier();

    Double getDistance();
}

