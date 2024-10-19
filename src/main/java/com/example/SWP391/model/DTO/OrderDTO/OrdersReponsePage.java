package com.example.SWP391.model.DTO.OrderDTO;

import com.example.SWP391.entity.Orders;
import lombok.Data;

import java.util.List;

@Data
public class OrdersReponsePage {
    List<Orders> content;
    int pageNumbers;
    int totalElements;
    int totalPages;
}
