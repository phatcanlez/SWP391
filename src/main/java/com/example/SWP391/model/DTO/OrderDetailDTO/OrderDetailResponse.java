package com.example.SWP391.model.DTO.OrderDetailDTO;

import com.example.SWP391.entity.Orders;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderDetailResponse {
    private int boxDetailId;
    private int smallBox;
    private int mediumBox;
    private int largeBox;
    private int extraLargeBox;
    private float kilometer;
    private double totalWeight;
    private int quantity;
    private String type;
    private String shipMethodId;
    private Orders orders;
}
