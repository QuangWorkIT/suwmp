package com.example.suwmp_be.dto.enterprise_profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record EnterpriseUpdateProfileRequest(
        @Positive
        Long id,

        @NotBlank
        @Size(min = 2, max = 100)
        @Pattern(
                regexp = "^[A-Za-zÀ-ỹà-ỹ]+(?:\\s[A-Za-zÀ-ỹà-ỹ]+)*$",
                message = "Name must contain only letters and spaces"
        )
        String name,

        @Size(min = 10, max = 500)
        String description,

        String photoUrl
) {
}
