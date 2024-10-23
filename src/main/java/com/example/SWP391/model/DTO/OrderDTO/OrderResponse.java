package com.example.SWP391.model.DTO.OrderDTO;

import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Status;
import com.example.SWP391.model.Enum.StatusInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Setter;

import java.util.Date;

@Data
@Setter
public class OrderResponse {
    String orderID;
    String name;
    Status status;
    String payment;
}
