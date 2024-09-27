//package com.example.SWP391.entity;
//
//import com.example.SWP391.model.Enum.StatusInfo;
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import java.util.Date;
//
//@Entity
//@NoArgsConstructor
//@AllArgsConstructor
//@Getter
//@Setter
//public class Status {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    long id;
//
//    @NotBlank(message = "Status name is required")
//    @Column(name = "status_name", nullable = false)
//    String description;
//
//    Date date;
//    Employee employee;
//
//    @Enumerated(EnumType.STRING)
//    StatusInfo statusInfo;
//}
