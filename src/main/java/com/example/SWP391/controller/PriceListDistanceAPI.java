package com.example.SWP391.controller;

import com.example.SWP391.entity.PriceListDistance;
import com.example.SWP391.service.PriceListDistanceService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class PriceListDistanceAPI {

        @Autowired
        private PriceListDistanceService priceListDistanceService;

        @PostMapping("/api/pricelistdistance")
        public ResponseEntity createPriceDistance(@Valid @RequestBody PriceListDistance priceListDistance) {
            return ResponseEntity.ok(priceListDistanceService.createPriceDistance(priceListDistance));
        }

        @GetMapping("/api/pricelistdistance")
        public ResponseEntity getAllPriceDistance() {
                List<PriceListDistance> list = priceListDistanceService.getAllPriceDistance();
                return ResponseEntity.ok(list);
        }

        @GetMapping("/api/pricelistdistance/{id}")
        public ResponseEntity getPriceDistanceById(@PathVariable long id) {
            return ResponseEntity.ok(priceListDistanceService.viewPriceDistanceById(id));
        }


        @PutMapping("/api/pricelistdistance")
        public ResponseEntity updatePriceDistance(@RequestBody @Valid PriceListDistance priceListDistance, long id) {
            return ResponseEntity.ok(priceListDistanceService.updatePriceDistance(priceListDistance, id));
        }

}
