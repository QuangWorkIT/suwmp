package com.example.suwmp_be.repository.projection;

import java.time.LocalDate;
import java.util.UUID;

public interface CitizenDateProjection {
    UUID getCitizenId();
    LocalDate getSnapshotDate();
}