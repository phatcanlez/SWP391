package com.example.SWP391.model.DTO.statusDTO;

import com.example.SWP391.model.Enum.StatusInfo;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StatusRequest {

    @Enumerated(EnumType.STRING)
    StatusInfo statusInfo;
}
