package com.example.SWP391.controller;

import com.example.SWP391.entity.PriceListDistance;
import com.example.SWP391.model.DTO.TrackingDTO.EstimateTrackingRequestByBox;
import com.example.SWP391.service.TrackingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class TrackingAPI {
    @Autowired
    private TrackingService trackingService;

    @GetMapping("/api/tracking/{shipMethodID}")
    public ResponseEntity getTrackingList(@PathVariable long shipMethodID) {
        return ResponseEntity.ok(trackingService.getTrackingList(shipMethodID));
    }

    @GetMapping("/api/tracking/weight/{shipMethodID}")
    public ResponseEntity getTrackingWeightList(@PathVariable long shipMethodID) {
        return ResponseEntity.ok(trackingService.getPriceWeightListByShipMethod(shipMethodID));
    }

    @PostMapping("/api/tracking/estimate")
    public ResponseEntity estimateTrackingByBox(@RequestBody EstimateTrackingRequestByBox estimateTrackingRequestByBox) {
        return ResponseEntity.ok(trackingService.estimateTrackingByBox(estimateTrackingRequestByBox));
    }

    @GetMapping("/api/tracking/history/{orderID}")
    public ResponseEntity getTrackingByOrderID(@PathVariable String orderID) {
        return ResponseEntity.ok(trackingService.getTrackingByOrderID(orderID));
    }

    @PostMapping("/api/tracking/RouteMatrix")
    public ResponseEntity getRouteMatrix(@RequestBody List<String> addresses) {
        return ResponseEntity.ok(trackingService.getRouteMatrix(addresses));
    }
}
