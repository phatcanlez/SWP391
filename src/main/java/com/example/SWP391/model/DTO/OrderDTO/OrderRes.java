package com.example.SWP391.model.DTO.OrderDTO;

import com.example.SWP391.entity.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class OrderRes {
    String orderID;
    String reciverAdress;
    String senderAddress;
    String senderPhoneNumber;
    Date expDeliveryDate;
    Date actDeliveryDate;
    double orderPrice;
    String note;
    String image;
    String finishImage;
    String reciverPhoneNumber;
    String reciverName;
    double totalPrice;
    List<Status> status;
    List<License> licenses;
    List<Report> reports;
    Payment payment;
    List<Feedback> feedbacks;
    OrderDetail orderDetail;
    String senderName;
    String accountId;
    String username;
}
