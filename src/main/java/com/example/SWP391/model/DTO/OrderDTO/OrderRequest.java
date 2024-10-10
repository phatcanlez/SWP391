package com.example.SWP391.model.DTO.OrderDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Getter;

import java.util.Date;

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

    @NotBlank
    String Username;
}
