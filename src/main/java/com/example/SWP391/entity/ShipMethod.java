package com.example.SWP391.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ShipMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long shipMethodId;

    @NotBlank(message = "Type of ship is required")
    String typeOfShip;
}
