package com.example.SWP391.model.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class CustomerAccResponse {
    String email;
    String address;
    Date birthday;
    String phoneNumber;
    String avatar;
    String status;
    String name;
}
