package com.example.SWP391.controller;

import com.example.SWP391.entity.BoxPrice;
import com.example.SWP391.service.BoxPriceService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class BoxPriceAPI {

        @Autowired
        private BoxPriceService boxPriceService;

        @PostMapping("/api/boxprice")
        public ResponseEntity createOrderDetail(@Valid @RequestBody BoxPrice boxPrice) {
            return ResponseEntity.ok(boxPriceService.createBoxPrice(boxPrice));
        }

        @GetMapping("/api/boxprice")
        public ResponseEntity getAllOrdersDetail() {
                List<BoxPrice> list = boxPriceService.getAllBoxPrice();
                return ResponseEntity.ok(list);
        }

        @GetMapping("/api/boxprice/{id}")
        public ResponseEntity getLicenseById(@PathVariable long id) {
            return ResponseEntity.ok(boxPriceService.viewBoxPriceById(id));
        }


        @PutMapping("/api/boxprice")
        public ResponseEntity updateLicense(@RequestBody @Valid BoxPrice boxPrice, long id) {
            return ResponseEntity.ok(boxPriceService.updateBoxPrice(boxPrice, id));
        }

}
