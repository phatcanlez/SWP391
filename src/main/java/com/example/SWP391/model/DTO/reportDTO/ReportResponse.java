package com.example.SWP391.model.DTO.reportDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Date;

@Data
public class ReportResponse {
    long id;
    Date time;
    String status;
    String reportContent;
    String employeeId;
    String empReply;
    String orderId;
}
