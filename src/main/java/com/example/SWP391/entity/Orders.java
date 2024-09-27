package com.example.SWP391.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    String orderID;

    Date orderDate;

    @NotBlank(message = "Address is required")
    String reciverAdress;

    Date expDeliveryDate;

    Date actDeliveryDate;

    @NotBlank(message = "Price of your Koi is required")
    double orderPrice;

    String note;

    @NotBlank(message = "Phone number of receiver is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String reciverPhoneNumber;

    @NotBlank(message = "Name of receiver is required")
    String reciverName;

    @NotBlank(message = "Total price is required")
    double totalPrice;

    @Enumerated(EnumType.STRING)
    StatusInfo statusInfo;
}
