package com.example.suwmp_be.dto.forgot_password;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordRequest {
        String resetToken;

        @NotEmpty
        @Size(min = 8, max = 50)
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, and one digit."
        )
        String newPassword;
}
