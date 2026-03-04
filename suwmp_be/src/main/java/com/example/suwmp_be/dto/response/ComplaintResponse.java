package com.example.suwmp_be.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintResponse {
    private Long id;
    private String description;
    private String status;
    private String citizenName;
    private LocalDateTime createdAt;
}
