package com.example.SWP391.model.DTO.OrderDTO;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
public class OrderTotalStatus {
    int totalApproved;
    int totalPending;
    int totalRejected;
    int totalSuccess;
}
