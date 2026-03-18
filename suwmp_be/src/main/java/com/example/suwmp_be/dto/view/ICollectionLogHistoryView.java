package com.example.suwmp_be.dto.view;

import java.time.OffsetDateTime;
import java.util.UUID;

public interface ICollectionLogHistoryView {
    Long getId();
    Long getWasteReportId();
    UUID getCollectorId();
    String getProofPhotoUrl();
    OffsetDateTime getCollectedTime();
    Double getWasteReportLongitude();
    Double getWasteReportLatitude();
    Double getWasteReportWeight();
    String getWasteReportStatus();
    Integer getPoints();
    String getWasteTypeName();
}
