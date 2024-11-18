package com.example.SWP391.model.DTO.OrderDTO;

import lombok.Data;

import java.util.List;

@Data
public class OrderListAndTotal {
    List<OrderResponse> listOrders;
    int Total;
}
