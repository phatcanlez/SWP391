package com.example.SWP391.model.DTO.extraServiceDTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ExtraServiceRequest {
    @NotBlank(message = "Service name is required")
    @Column(unique = true)
    String nameService;

    @Size(min = 0,message = "Price must positive number")
    float price;
}
