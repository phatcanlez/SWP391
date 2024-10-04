package com.example.SWP391.model.DTO.authenticatonDTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AccountResponse {
    String Id;
    String email;
    String name;
    String username;
    String phoneNumber;
    String token;
    String role;
}
