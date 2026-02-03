package com.example.suwmp_be.exception;

import com.example.suwmp_be.constants.ErrorCode;

public class BadRequestException extends ApplicationException {
    public BadRequestException(ErrorCode errorCode) {
        super(errorCode);
    }

    @Override
    public String toString() {
        return BadRequestException.class.getName() + ": " + this.errorCode.getMessage();
    }
}
