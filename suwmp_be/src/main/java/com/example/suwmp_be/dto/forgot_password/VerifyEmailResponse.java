package com.example.suwmp_be.dto.forgot_password;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyEmailResponse {
    String otp;
}
