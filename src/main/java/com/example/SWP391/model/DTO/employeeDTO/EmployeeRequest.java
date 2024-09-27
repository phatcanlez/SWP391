package com.example.SWP391.model.DTO.employeeDTO;

import com.example.SWP391.model.Enum.Role;
import lombok.Data;

@Data
public class EmployeeRequest {
    String email;
    String name;
    String phoneNumber;
    String password;
    String avatar;
    String status;
    Role role;


}
