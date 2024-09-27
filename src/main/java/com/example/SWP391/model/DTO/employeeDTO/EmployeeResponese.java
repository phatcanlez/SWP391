package com.example.SWP391.model.DTO.employeeDTO;

import com.example.SWP391.model.Enum.Role;
import lombok.Data;

@Data
public class EmployeeResponese {
    String email;
    String name;
    String phoneNumber;
    String avatar;
    String status;
    Role role;

}
