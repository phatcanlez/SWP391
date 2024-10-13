package com.example.SWP391.model.DTO.BoxPriceDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BoxPriceRequest {
    @NotBlank(message = "Box size is required")
    private String boxSize;

    @Min(value = 0,message = "Price must positive number")
    private float price;

    @Min(value = 0,message = "Surcharge must positive number")
    private float surcharge;
}
