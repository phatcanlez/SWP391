package com.example.SWP391.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class License {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    Date date;

    @NotBlank(message = "License name is required")
    String name;

    @NotBlank(message = "Image Koi License is required")
    String imgLicense;

    @NotBlank(message = "Image Koi is required")
    String imgKoi;

    @Min(value = 0, message = "Price of Koi must be greater than 0")
    double priceOfKoi;

    @Min(value = 0, message = "Price of License must be greater than 0")
    float weight;

    @Min(value = 0, message = "Price of License must be greater than 0")
    float size;

    @Size(min = 0, max = 200, message = "Description must be between 0 and 200 characters")
    String description;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    Orders orders;
}
