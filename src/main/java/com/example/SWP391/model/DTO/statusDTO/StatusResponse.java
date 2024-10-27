package com.example.SWP391.model.DTO.statusDTO;

import com.example.SWP391.entity.Status;
import com.example.SWP391.model.Enum.StatusInfo;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Date;

@Data
public class StatusResponse {
    long id;
    String description;
    Date date;
    String empId;
    StatusInfo statusInfo;
    String orderID;
}
