package com.example.SWP391.model.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Date;

@Data
public class CustomerResponse {
    String name;
    String address;
    String phoneNumber;
    String avatar;
    String password;
    String email;
    Date birthday;
    String token;
}
