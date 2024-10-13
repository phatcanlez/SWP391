package com.example.SWP391.model.DTO.OrderDTO;

import com.example.SWP391.entity.Account;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.Date;

@Data
public class OrderResponse {
    String reciverAdress;
    String senderAddress;
    String senderPhoneNumber;
    Date expDeliveryDate;
    double orderPrice;
    String note;
    String reciverPhoneNumber;
    String reciverName;
    double totalPrice;
    @JsonIgnore
    Account account;
}
