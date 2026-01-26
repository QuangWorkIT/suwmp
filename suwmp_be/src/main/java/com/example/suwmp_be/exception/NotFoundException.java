package com.example.suwmp_be.exception;

import com.example.suwmp_be.constants.ErrorCode;

public class NotFoundException extends ApplicationException {
    public NotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }

    @Override
    public String toString() {
        return NotFoundException.class.getName() + ": " + this.errorCode.getMessage();
    }
}
