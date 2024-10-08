package com.example.SWP391.model.DTO.OrderDetailDTO;

import com.example.SWP391.entity.ExtraService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class OrderDetailRequest {
    @Min(value = 0, message = "box must be positive number")
    int smallBox;

    @Min(value = 0, message = "box must be positive number")
    int mediumBox;

    @Min(value = 0, message = "box must be positive number")
    int largeBox;

    @Min(value = 0, message = "box must be positive number")
    int extraLargeBox;

    @Min(value = 0, message = "kilometer must be positive number")
    float kilometer;

    @NotBlank(message = "Ship method is required")
    String shipMethodId;

    List<ExtraService> extraServices;

    @NotBlank(message = "Order ID is required")
    String orderID;
}
