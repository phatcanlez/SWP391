package com.example.SWP391.model.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Date;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    String name;

    @NotBlank(message = "Address is required")
    String address;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String phoneNumber;

    String avatar;

    @NotBlank(message = "Password is required")
    String password;

    @NotBlank(message = "Confirm password is required")
    String confirmPassword;

    @Email(message = "Email not valid")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    String email;

    Date birthday;
}
