package com.example.SWP391.model.DTO.OrderDetailDTO;

import lombok.Data;

@Data
public class OrderDetailResponse {
    private int boxDetailId;
    private int smallBox;
    private int mediumBox;
    private int largeBox;
    private int extraLargeBox;
    private float kilometer;
    private String shipMethodId;
    private String orderID;
}
