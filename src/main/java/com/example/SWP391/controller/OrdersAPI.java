package com.example.SWP391.controller;

import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Status;
import com.example.SWP391.service.OrderService;
import jakarta.validation.Valid;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
public class OrdersAPI {

        @Autowired
        private OrderService orderService;

        @PostMapping("/api/orders")
        public ResponseEntity createLicense(@Valid @RequestBody Orders orders) {
            return ResponseEntity.ok(orderService.createOrder(orders));
        }

        @GetMapping("/api/orders")
        public ResponseEntity getAllOrders() {
                List<Orders> list = orderService.getAllOrders();
                return ResponseEntity.ok(list);
        }

        @GetMapping("/api/orders/{id}")
        public ResponseEntity getLicenseById(@PathVariable String id) {
            return ResponseEntity.ok(orderService.viewOrderById(id));
        }


        @PutMapping("/api/orders")
        public ResponseEntity updateLicense(@RequestBody @Valid Orders order, String id) {
            return ResponseEntity.ok(orderService.updateOrder(order, id));
        }

}
