package com.example.suwmp_be.exception;

public class InvalidCredential extends RuntimeException {
    public InvalidCredential(String message) {
        super(message);
    }
}
