package com.example.SWP391.controller;

import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Status;
import com.example.SWP391.model.DTO.OrderDTO.OrderRequest;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
import com.example.SWP391.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class OrdersAPI {

        @Autowired
        private OrderService orderService;

        @PostMapping("/api/orders")
        public ResponseEntity createOrder(@Valid @RequestBody OrderRequest orders) throws Exception {
                return ResponseEntity.ok(orderService.createOrder(orders));
        }



        @GetMapping("/api/orders")
        public ResponseEntity getAllOrders(@RequestParam int page, @RequestParam int size) {
                return ResponseEntity.ok(orderService.getAllOrders(page,size));
        }

        @GetMapping("/api/orders/{id}")
        public ResponseEntity getLicenseById(@PathVariable String id) {
            return ResponseEntity.ok(orderService.viewOrderById(id));

        }

        @GetMapping("/api/orders/status")
        public ResponseEntity getOrderByStatus(@RequestParam String status) {
                return ResponseEntity.ok(orderService.viewOrderByStatus(status));
        }

        @GetMapping("/api/orders/status-emp")
        public ResponseEntity getOrderByStatusAndEmpId(@RequestParam String status, String empId) {
                return ResponseEntity.ok(orderService.viewOrderByStatusAndEmpId(status, empId));
        }

        @GetMapping("/api/orders/account")
        public ResponseEntity getOrderByAccount(@RequestParam String username) {
                return ResponseEntity.ok(orderService.viewOrderByAccount(username));
        }

        @PutMapping("/api/orders")
        public ResponseEntity updateLicense(@RequestBody @Valid OrderRequest order, String id) {
                return ResponseEntity.ok(orderService.updateOrder(order, id));
        }

}
