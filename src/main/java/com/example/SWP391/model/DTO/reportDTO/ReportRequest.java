package com.example.SWP391.model.DTO.reportDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportRequest {

    @NotBlank(message = "Content is required")
    String reportContent;

    @NotBlank(message = "Order ID is required")
    String order;
}
