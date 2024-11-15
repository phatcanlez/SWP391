package com.example.SWP391.model.DTO.OrderDTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Getter;

import java.util.Date;
import java.util.Set;

@Data
@Getter
public class OrderRequest {

    @NotBlank(message = "Address is required")
    String reciverAdress;

    @NotBlank(message = "Sender address is required")
    String senderAddress;

    @NotBlank(message = "Sender phone is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String senderPhoneNumber;

    Date expDeliveryDate;

    @Min(value = 0, message = "Price of your Koi is required and must be positive number")
    double orderPrice;

    String note;

    @NotBlank(message = "Phone number of receiver is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String reciverPhoneNumber;

    @NotBlank(message = "Name of receiver is required")
    String reciverName;

    @Min(value = 0, message = "Total price must be positive number")
    double totalPrice;

    @NotBlank(message = "Username is required")
    String Username;

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
    @Max(value = 3, message = "shipMethodId must be less than 3")
    long shipMethod;

    Set<Long> extraService;
}
