package com.example.suwmp_be.dto.response;

import lombok.Data;

@Data
public class ComplaintResponse {
    private Long id;
    private String description;
    private String status;
    private String citizenName;
}
