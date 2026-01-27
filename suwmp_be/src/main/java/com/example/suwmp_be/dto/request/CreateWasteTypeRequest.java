package com.example.suwmp_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateWasteTypeRequest {

    @NotBlank(message = "Waste type name is required")
    @Size(max = 255, message = "Full name must not exceed 255 characters")
    private String name;

    private String description;
}
