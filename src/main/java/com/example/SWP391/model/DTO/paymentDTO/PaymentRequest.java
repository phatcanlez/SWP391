package com.example.SWP391.model.DTO.paymentDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotBlank(message = "Type of payment method is required")
    String typeOfPay;

    @NotBlank(message = "Status is required")
    String status;
}
