package com.example.SWP391.controller;

import com.example.SWP391.entity.Payment;
import com.example.SWP391.model.DTO.paymentDTO.PaymentRequest;
import com.example.SWP391.model.DTO.paymentDTO.PaymentStatusRequest;
import com.example.SWP391.service.PaymentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
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
        public ResponseEntity updatePaymentUser(@RequestBody @Valid PaymentRequest paymentRequest) {
            return ResponseEntity.ok(paymentService.updatePayment(paymentRequest));
        }

        @PutMapping("/api/payment-status")
        public ResponseEntity updatePaymentStatus(@RequestParam String orderId, PaymentStatusRequest paymentStatusRequest) {
                return ResponseEntity.ok(paymentService.updatePaymentStatus(orderId, paymentStatusRequest));
        }



}
