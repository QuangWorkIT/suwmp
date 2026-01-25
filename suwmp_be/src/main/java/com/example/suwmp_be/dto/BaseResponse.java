package com.example.suwmp_be.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Base response wrapper for all API responses")
public class BaseResponse<T> {
    @Schema(description = "Indicates if the request was successful", example = "true")
    private boolean isSuccess;
    @Schema(description = "Response message", example = "Operation successful")
    private String message;
    @Schema(description = "Response data payload")
    private T data;

    public BaseResponse(boolean isSuccess, String message) {
        this.isSuccess = isSuccess;
        this.message = message;
    }
}
