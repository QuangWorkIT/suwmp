package com.example.suwmp_be.dto.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ErrorResponse {
    String title;
    String message;

    @JsonInclude(value = JsonInclude.Include.NON_EMPTY)
    List<ErrorDetail> errors;
}
