package com.example.SWP391.model.DTO.reportDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportUpdateRequest {

    @NotBlank(message = "Employee Reply is required")
    String empReply;
}
