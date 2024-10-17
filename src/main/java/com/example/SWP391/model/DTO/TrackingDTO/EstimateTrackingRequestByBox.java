package com.example.SWP391.model.DTO.TrackingDTO;

import lombok.Data;

@Data
public class EstimateTrackingRequestByBox {
    double kilometers;
    long shipMethodID;
    BoxAmountDTO boxAmountDTO;
}
