package com.example.suwmp_be.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse<T> {
    String message;
    T data;
}
