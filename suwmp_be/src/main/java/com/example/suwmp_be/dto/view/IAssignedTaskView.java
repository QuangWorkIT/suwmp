package com.example.suwmp_be.dto.view;

import java.time.OffsetDateTime;

public interface IAssignedTaskView {
    Long getRequestId();
    String getWasteTypeName();
    Double getRequestLongitude();
    Double getRequestLatitude();
    Double getVolume();
    String getPriority();
    String getCurrentStatus();
    String getCitizenName();
    String getCitizenPhone();
    String getCollectorId();
    String getPhotoUrl();
    OffsetDateTime getCollectTime();
}
