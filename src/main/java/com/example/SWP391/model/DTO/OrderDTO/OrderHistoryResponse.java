package com.example.SWP391.model.DTO.OrderDTO;

import com.example.SWP391.model.Enum.StatusInfo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Date;

@Data
public class OrderHistoryResponse {
    String orderID;
    Date orderCreateDate;
    Date actDeliveryDate;
    String senderAddress;
    String reciverName;
    String reciverAdress;
    double totalPrice;
    String status;

}
