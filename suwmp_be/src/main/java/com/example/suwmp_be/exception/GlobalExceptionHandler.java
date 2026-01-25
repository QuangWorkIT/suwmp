package com.example.suwmp_be.exception;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.error.ErrorDetail;
import com.example.suwmp_be.dto.error.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(value = ApplicationException.class)
    ResponseEntity<ErrorResponse> handlingApplicationException(ApplicationException exception) {
        ErrorCode errorCode = exception.getErrorCode();

        log.error(errorCode.getTitle(), exception);

        ErrorResponse response = new ErrorResponse().builder()
                .title(errorCode.getTitle())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(value = NotFoundException.class)
    ResponseEntity<ErrorResponse> handlingNotFoundException(NotFoundException exception) {
        ErrorCode errorCode = exception.getErrorCode();

        log.warn(errorCode.getTitle(), exception);

        ErrorResponse errorResponse = new ErrorResponse().builder()
                .title(errorCode.getTitle())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(value = AuthenticationException.class)
    ResponseEntity<ErrorResponse> handlingAuthenticationException(AuthenticationException exception) {
        ErrorCode errorCode = exception.getErrorCode();

        log.warn(errorCode.getTitle(), exception);

        ErrorResponse errorResponse = new ErrorResponse().builder()
                .title(errorCode.getTitle())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    ResponseEntity<ErrorResponse> handlingHttpMessageNotReadableException(HttpMessageNotReadableException exception) {
        ErrorCode errorCode = ErrorCode.BAD_REQUEST_BODY_MISSING;

        log.warn(errorCode.getTitle(), exception);

        ErrorResponse response = new ErrorResponse().builder()
                .title(errorCode.getTitle())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ErrorResponse> handlingMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        ErrorCode errorCode = ErrorCode.VALIDATION_FAILED;

        log.warn(errorCode.getTitle(), exception);

        var errors = getValidationError(exception);
        List<ErrorDetail> errorDetails = errors.entrySet().stream()
                .map(e -> new ErrorDetail(
                        e.getKey(),
                        e.getValue()
                ))
                .toList();

        ErrorResponse errorResponse = new ErrorResponse().builder()
                .title(errorCode.getTitle())
                .message(errorCode.getMessage())
                .errors(errorDetails)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    private Map<String, String[]> getValidationError(MethodArgumentNotValidException exception) {
        Map<String, String[]> fieldErrors = exception.getFieldErrors().stream()
                .collect(Collectors.groupingBy(
                        FieldError::getField,
                        Collectors.mapping(
                                FieldError::getDefaultMessage,
                                Collectors.collectingAndThen(
                                        Collectors.toSet(),
                                        s -> s.toArray(String[]::new)
                                )
                        )
                ));

        Map<String, String[]> globalErrors = exception.getGlobalErrors().stream()
                .collect(Collectors.groupingBy(
                        ObjectError::getObjectName,
                        Collectors.mapping(
                                ObjectError::getDefaultMessage,
                                Collectors.collectingAndThen(
                                        Collectors.toSet(),
                                        s -> s.toArray(String[]::new)
                                )
                        )
                ));

        Map<String, String[]> allErrors = new HashMap<>(fieldErrors);
        allErrors.putAll(globalErrors);

        return allErrors;
    }
}
