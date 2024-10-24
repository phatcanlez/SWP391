package com.example.SWP391.model.DTO.authenticatonDTO;

import com.example.SWP391.model.Enum.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateAccountRequestByManager {
    String id;
    String name;
    @Email(message = "Email not valid")
    String email;
    String avatar;
    String status;
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String phoneNumber;
    String address;
    Role role;
}
