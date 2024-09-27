//package com.example.SWP391.entity;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.Min;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.Pattern;
//import lombok.*;
//
//import java.util.Date;
//
//@AllArgsConstructor
//@NoArgsConstructor
//@Setter
//@Getter
//@Entity
//public class Orders {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    long orderID;
//
//    Date orderDate;
//
//    @NotBlank(message = "Address is required")
//    String reciverAdress;
//
//    Date expDeliveryDate;
//
//    Date actDeliveryDate;
//
//    @Min(value = 0, message = "Price of your Koi is required")
//    double orderPrice;
//
//    String note;
//
//    @NotBlank(message = "Phone number of receiver is required")
//    @Pattern(regexp = "\\d{10}", message = "Invalid phone number!")
//    String reciverPhoneNumber;
//
//    @NotBlank(message = "Name of receiver is required")
//    String reciverName;
//
//    @Min(value = 0, message = "Total price must be positive number")
//    double totalPrice;
//
////    Status statusInfo;
//}
