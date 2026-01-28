package com.example.suwmp_be.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WasteTypeResponse {

    private Integer id;

    private String name;

    private String description;
}
