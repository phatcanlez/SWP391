package com.example.SWP391.model.DTO.authenticatonDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateAccountRequest {
    String name;
    @Email(message = "Email not valid")
    String email;
    String avatar;
    boolean status;
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String phoneNumber;
    String address;
}
