package com.example.SWP391.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
public class OverseaOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String orderId;
    String employeeId1;
    String employeeId2;
}
