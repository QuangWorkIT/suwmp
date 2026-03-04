package com.example.suwmp_be.dto.view;

import java.time.Instant;

public interface ICollectionRequestView {
    Long getRequestId();
    Long getEnterpriseId();
    String getWasteTypeName();
    Double getRequestLongitude();
    Double getRequestLatitude();
    Double getVolume();
    String getPriority();
    String getCurrentStatus();
    String getCitizenName();
    String getCitizenPhone();
    String getCollectorName();
    Instant getCreatedAt();
}
