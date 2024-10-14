package com.example.SWP391.model.DTO.authenticatonDTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    String name;

    @NotBlank(message = "Username is required")
    @Column(unique = true)
    String username;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String phoneNumber;

    String avatar;

    String address;

    @NotBlank(message = "Password is required")
    String password;

    @Email(message = "Email not valid")
    @NotBlank(message = "Email is required")
    String email;

    @Pattern(regexp = "STAFF|MANAGER|CUSTOMER", message = "Role must be STAFF, MANAGER, or CUSTOMER")
    String role;
}
