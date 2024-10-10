package com.example.SWP391.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
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
public class PriceListDistance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long priceListId;

    @NotBlank(message = "Distance is required")
    String distance;

    @Min(value = 0, message = "Price must be positive number")
    float price;

    @ManyToOne
    @JoinColumn(name = "ship_method_id")
    @JsonIgnore
    ShipMethod shipMethod;
}
