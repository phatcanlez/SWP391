package com.example.SWP391.controller;

import com.example.SWP391.entity.PriceListWeight;
import com.example.SWP391.service.PriceListWeightService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class PriceListWeightAPI {

        @Autowired
        private PriceListWeightService priceListWeightService;

        @PostMapping("/api/pricelistweight")
        public ResponseEntity createPriceWeight(@Valid @RequestBody PriceListWeight priceListWeight) {
            return ResponseEntity.ok(priceListWeightService.createPriceWeight(priceListWeight));
        }

        @GetMapping("/api/pricelistweight")
        public ResponseEntity getAllPriceWeight() {
                List<PriceListWeight> list = priceListWeightService.getAllPriceWeight();
                return ResponseEntity.ok(list);
        }

        @GetMapping("/api/pricelistweight/{id}")
        public ResponseEntity getPriceWeightById(@PathVariable long id) {
            return ResponseEntity.ok(priceListWeightService.viewPriceWeightById(id));
        }


        @PutMapping("/api/pricelistweight/{id}")
        public ResponseEntity updatePriceWeight(@RequestBody @Valid PriceListWeight priceListWeight,@PathVariable long id) {
            return ResponseEntity.ok(priceListWeightService.updatePriceWeight(priceListWeight, id));
        }

}
