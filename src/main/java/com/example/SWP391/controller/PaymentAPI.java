package com.example.SWP391.controller;

import com.example.SWP391.entity.Payment;
import com.example.SWP391.model.DTO.paymentDTO.PaymentRequest;
import com.example.SWP391.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
public class PaymentAPI {

        @Autowired
        private PaymentService paymentService;

        @PostMapping("/api/payment")
        public ResponseEntity createPayment(@Valid @RequestBody PaymentRequest paymentRequest) {
            return ResponseEntity.ok(paymentService.createPayment(paymentRequest));
        }

        @GetMapping("/api/payment")
        public ResponseEntity getAllPayment() {
                List<Payment> list = paymentService.getAllPayment();
                return ResponseEntity.ok(list);
        }

        @GetMapping("/api/payment/{id}")
        public ResponseEntity getLicenseById(@PathVariable long id) {
            return ResponseEntity.ok(paymentService.viewPaymentById(id));
        }


        @PutMapping("/api/payment")
        public ResponseEntity updateLicense(@RequestBody @Valid PaymentRequest paymentRequest, long id) {
            return ResponseEntity.ok(paymentService.updatePayment(paymentRequest, id));
        }

}
