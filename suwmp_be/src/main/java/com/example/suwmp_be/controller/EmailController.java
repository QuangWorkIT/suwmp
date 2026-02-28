package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.email.SendPasswordDto;
import com.example.suwmp_be.serviceImpl.EmailService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailController {
    EmailService emailService;

    @PostMapping("/send-password")
    public ResponseEntity<BaseResponse<?>> sendPassword(@Valid @RequestBody SendPasswordDto request) {
        emailService.sendPassword(request);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new BaseResponse<>(
                        true,
                        "Send password to user email successfully")
                );
    }
}
