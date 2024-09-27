package com.example.SWP391.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String orderid;

    @Temporal(TemporalType.DATE)
    Date orderDate;

    @NotBlank(message = "Address is required")
    String reciverAdress;

    @Temporal(TemporalType.DATE)
    Date expDeliveryDate;

    @Temporal(TemporalType.DATE)
    Date actDeliveryDate;

    @Size(min = 0, message = "Price of your Koi is required")
    double orderPrice;

    String note;

    @NotBlank(message = "Phone number of receiver is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String reciverPhoneNumber;

    @NotBlank(message = "Name of receiver is required")
    String reciverName;

    @NotNull(message = "Total price is required")
    double totalPrice;

}
