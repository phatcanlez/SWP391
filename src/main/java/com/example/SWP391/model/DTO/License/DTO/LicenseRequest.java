package com.example.SWP391.model.DTO.License.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;

@Data
public class LicenseRequest {
    Date date;

    @NotBlank(message = "License name is required")
    String name;

    @NotBlank(message = "License type is required")
    String type;

    @Size(min = 0, max = 200, message = "Description must be between 0 and 200 characters")
    String description;

    @NotBlank(message = "Order ID is required")
    String orderID;
}
