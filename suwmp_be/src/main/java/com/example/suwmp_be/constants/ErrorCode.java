package com.example.suwmp_be.constants;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    BAD_REQUEST_BODY_MISSING("Bad Request", "Required request body is missing"),
    VALIDATION_FAILED("Validation Failed", "Validation failed"),
    UNAUTHORIZED("Unauthorized", "Unauthorized access"),
    ERROR_SYSTEM("Error System", "A system error occurred"),

    EMAIL_NOT_EXIST("Not Found", "Email does not exist"),
    RESET_TOKEN_INVALID("Unauthenticated", "Reset password token expired or not valid"),
    ACCESS_TOKEN_INVALID("Unauthenticated", "Invalid or expired JWT"),
    USER_ID_INVALID("Bad Request", "Invalid user ID in token"),
    GOOGLE_ID_TOKEN_INVALID("Unauthenticated", "Invalid Google ID Token"),

    EMAIL_EXISTED("Bad Request", "Email already exists"),
    PHONE_EXISTED("Bad Request", "Phone already exists"),

    USER_NOT_FOUND("Not Found", "User not found"),
    USER_ALREADY_EXISTS("Bad Request", "User already exists"),
    USER_INACTIVE("Unauthenticated", "User is inactive"),

    ENTERPRISE_NOT_FOUND("Not Found", "Enterprise not found"),
    WASTE_REPORT_NOT_FOUND("Not Found", "Waste report not found"),
    COLLECTOR_NOT_IN_ENTERPRISE("Bad Request", "Collector does not belong to this enterprise"),
    COLLECTOR_NOT_AVAILABLE("Bad Request", "Collector is not available for assignment"),
    USER_NOT_ENTERPRISE_OWNER("Bad Request","User is not the owner of the enterprise"),
    USER_NOT_COLLECTOR("Forbidden", "User is not a collector"),

    DUPLICATED_DATA("Duplicated Data", "Data is duplicated"),
    NOT_FOUND_DATA("Not Found", "Data is not found"),
    CAPACITY_NOT_EXISTED("Bad Request", "Corresponding enterprise capacity is not existed"),
    ALREADY_RATED("Bad Request", "You have already rated this report"),
    INVALID_REPORT_STATUS("Bad Request", "Rating is only allowed for collected reports"),
    REPORT_NOT_OWNED("Forbidden", "You do not own this report"),
    ISSUE_ALREADY_SUBMITTED("Conflict", "An issue has already been submitted for this report"),
    INVALID_FILE_TYPE("Bad Request", "Invalid file type. Only .jpg, .png, and .pdf are allowed"),
    FILE_SIZE_EXCEEDED("Bad Request", "File size exceeds the 5MB limit");

    ErrorCode(String title, String message) {
        this.title = title;
        this.message = message;
    }

    String title;
    String message;
}
