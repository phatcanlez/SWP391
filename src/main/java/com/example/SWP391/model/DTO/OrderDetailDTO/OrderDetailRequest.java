package com.example.SWP391.model.DTO.OrderDetailDTO;

import com.example.SWP391.entity.ExtraService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Set;

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

    @Min(value = 0, message = "total weight must be positive number")
    double totalWeight;

    @Min(value = 0, message = "quantity must be positive number")
    int quantity;

    @NotBlank(message = "Order type is required")
    String type;

    @Min(value = 0, message = "shipMethodId must be positive number")
    long shipMethodId;

    Set<Long> extraServiceId;

    @NotBlank(message = "Order ID is required")
    String orderID;
}
