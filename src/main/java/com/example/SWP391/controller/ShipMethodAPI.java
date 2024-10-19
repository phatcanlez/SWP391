package com.example.SWP391.controller;

import com.example.SWP391.entity.ShipMethod;
import com.example.SWP391.service.ShipMethodService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
public class ShipMethodAPI {

        @Autowired
        private ShipMethodService shipMethodService;

        @PostMapping("/api/shipmethod")
        public ResponseEntity createShipMethod(@Valid @RequestBody ShipMethod shipMethod) {
            return ResponseEntity.ok(shipMethodService.createShipMethod(shipMethod));
        }

        @GetMapping("/api/shipmethod")
        public ResponseEntity getAllShipMethod() {
                List<ShipMethod> list = shipMethodService.getAllShipMethod();
                return ResponseEntity.ok(list);
        }

        @GetMapping("/api/shipmethod/{id}")
        public ResponseEntity getShipmethodById(@PathVariable long id) {
            return ResponseEntity.ok(shipMethodService.viewShipMethodById(id));
        }


        @PutMapping("/api/shipmethod")
        public ResponseEntity updateLicense(@RequestBody @Valid ShipMethod shipMethod, long id) {
            return ResponseEntity.ok(shipMethodService.updateShipMethod(shipMethod, id));
        }

}
