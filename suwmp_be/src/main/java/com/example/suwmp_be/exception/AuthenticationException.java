package com.example.suwmp_be.exception;

import com.example.suwmp_be.constants.ErrorCode;

public class AuthenticationException extends ApplicationException {

    public AuthenticationException(ErrorCode errorCode) {
        super(errorCode);
    }

    @Override
    public String toString() {
        return AuthenticationException.class.getName() + ": " + this.errorCode.getMessage();
    }
}
