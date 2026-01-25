package com.example.suwmp_be.exception;

import com.example.suwmp_be.constants.ErrorCode;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationException extends RuntimeException {
    public ApplicationException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    protected final ErrorCode errorCode;

    @Override
    public String toString() {
        return ApplicationException.class.getName() + ": " + this.errorCode.getMessage();
    }
}
