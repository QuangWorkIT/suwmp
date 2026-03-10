package com.example.suwmp_be.exception;

import com.example.suwmp_be.constants.ErrorCode;
import lombok.Getter;

@Getter
public class ConflictException extends RuntimeException {
    private final ErrorCode errorCode;

    public ConflictException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
