package com.example.SWP391.model.DTO.reportDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportRequest {

    @NotBlank(message = "Status is required")
    String status;

    @NotBlank(message = "Content is required")
    String reportContent;

    @NotBlank(message = "Order ID is required")
    String orderID;
}
