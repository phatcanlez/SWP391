package com.example.SWP391.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String orderID;

    Date orderDate;

    @NotBlank(message = "Address is required")
    String reciverAdress;

    @NotBlank(message = "Sender address is required")
    String senderAddress;

    @NotBlank(message = "Sender phone is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String senderPhoneNumber;

    Date expDeliveryDate;

    Date actDeliveryDate;

    @Min(value = 0, message = "Price of your Koi is required")
    double orderPrice;

    String note;

    @NotBlank(message = "Phone number of receiver is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
    String reciverPhoneNumber;

    @NotBlank(message = "Name of receiver is required")
    String reciverName;

    @Min(value = 0, message = "Total price must be positive number")
    double totalPrice;

    @OneToMany(mappedBy = "orders",cascade = CascadeType.ALL)
    List<Status> status = new ArrayList<>();

    @OneToMany(mappedBy = "orders",cascade = CascadeType.ALL)
    List<License> licenses = new ArrayList<>();

    @OneToMany(mappedBy = "orders",cascade = CascadeType.ALL)
    List<Report> reports = new ArrayList<>();

    @OneToOne(mappedBy = "orders", cascade = CascadeType.ALL)
    Payment payment;

    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL)
    List<Feedback> feedbacks = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @JsonIgnore
    Account account;

    @OneToOne(mappedBy = "orders", cascade = CascadeType.ALL)
    OrderDetail orderDetail;
}
