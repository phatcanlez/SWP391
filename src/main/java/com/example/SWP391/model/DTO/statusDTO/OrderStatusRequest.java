package com.example.SWP391.model.DTO.statusDTO;


import com.example.SWP391.model.Enum.StatusInfo;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderStatusRequest {
    @Enumerated(EnumType.STRING)
    StatusInfo statusInfo;

    String empId;
}
