package com.example.SWP391.model.DTO.License.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;

@Data
public class LicenseRequest {

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

    @NotBlank(message = "Order ID is required")
    String order;

}
