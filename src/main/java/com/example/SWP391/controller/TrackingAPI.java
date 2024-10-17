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

    @GetMapping("/tracking/{shipMethodID}")
    public ResponseEntity getTrackingList(@PathVariable long shipMethodID) {
        return ResponseEntity.ok(trackingService.getTrackingList(shipMethodID));
    }

    @PostMapping("/tracking/estimate")
    public ResponseEntity estimateTrackingByBox(@RequestBody EstimateTrackingRequestByBox estimateTrackingRequestByBox) {
        return ResponseEntity.ok(trackingService.estimateTrackingByBox(estimateTrackingRequestByBox));
    }
}
