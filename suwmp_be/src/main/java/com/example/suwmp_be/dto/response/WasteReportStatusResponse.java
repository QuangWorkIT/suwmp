package com.example.suwmp_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WasteReportStatusResponse {

    private Long id;

    /**
     * Current status of the report:
     * PENDING / ACCEPTED / ASSIGNED / COLLECTED
     */
    private String status;

    private LocalDateTime createdAt;
}

