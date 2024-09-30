package com.example.SWP391.model.DTO.authenticatonDTO;

import lombok.Data;

@Data
public class CustomerResponse {
    String name;
    String address;
    String phoneNumber;
    String avatar;
    String password;
    String email;
    String token;
}
