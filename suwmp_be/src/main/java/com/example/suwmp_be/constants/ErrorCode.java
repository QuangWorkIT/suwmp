package com.example.suwmp_be.constants;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    EMAIL_NOT_EXIST("Not Found", "Email does not exist"),
    RESET_TOKEN_INVALID("Unauthenticated", "Reset password token expired or not valid"),

    BAD_REQUEST_BODY_MISSING("Bad Request", "Required request body is missing"),

    VALIDATION_FAILED("Validation Failed", "Validation failed"),
    ENTERPRISE_NOT_FOUND("Not Found", "Enterprise not found");

    ErrorCode(String title, String message) {
        this.title = title;
        this.message = message;
    }

    String title;
    String message;
}
