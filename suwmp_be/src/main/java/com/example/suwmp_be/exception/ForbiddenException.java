package com.example.suwmp_be.exception;

import com.example.suwmp_be.constants.ErrorCode;
import lombok.Getter;

@Getter
public class ForbiddenException extends RuntimeException {
    private final ErrorCode errorCode;

    public ForbiddenException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
