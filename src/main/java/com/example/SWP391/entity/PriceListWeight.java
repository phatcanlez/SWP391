package com.example.SWP391.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class PriceListWeight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long priceListId;

    @Size(min = 0,message = "weight must be positive number")
    float weight;

    @Size(min = 0,message = "Price must be positive number")
    float price;

}
