package com.example.suwmp_be.dto.enterprise_report;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CollectionTrendDTO {
    private String date;
    private Long totalCollections;
}
