package com.example.SWP391.model.DTO.statusDTO;

import com.example.SWP391.model.Enum.StatusInfo;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Date;

@Data
public class StatusRequest {

    String description;

    @NotBlank(message = "Employee ID is required")
    String empId;

    String statusInfo;

    @NotBlank(message = "OrderID is required")
    String order;
}
