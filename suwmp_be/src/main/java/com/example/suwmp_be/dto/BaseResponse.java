package com.example.suwmp_be.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseResponse<T> {
    private boolean isSuccess;
    private String message;
    private T data;

    public BaseResponse(boolean isSuccess, String message) {
        this.isSuccess = isSuccess;
        this.message = message;
    }
}
