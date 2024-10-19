package com.example.SWP391.model.DTO.forgotPassword;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @Email(message = "Email is not valid")
    String email;
}
