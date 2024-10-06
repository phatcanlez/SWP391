package com.example.SWP391.controller;

import com.example.SWP391.entity.OrderDetail;
import com.example.SWP391.entity.Orders;
import com.example.SWP391.service.OrderDetailService;
import com.example.SWP391.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
public class OrdersDetailAPI {

        @Autowired
        private OrderDetailService orderDetailService;

        @PostMapping("/api/orders-detail")
        public ResponseEntity createOrderDetail(@Valid @RequestBody OrderDetail orderDetail) {
            return ResponseEntity.ok(orderDetailService.createOrder(orderDetail));
        }

        @GetMapping("/api/orders-detail")
        public ResponseEntity getAllOrdersDetail() {
                List<OrderDetail> list = orderDetailService.getAllOrdersDetail();
                return ResponseEntity.ok(list);
        }

        @GetMapping("/api/orders-detail/{id}")
        public ResponseEntity getLicenseById(@PathVariable String id) {
            return ResponseEntity.ok(orderDetailService.viewOrderDetailById(id));
        }


        @PutMapping("/api/orders-detail")
        public ResponseEntity updateLicense(@RequestBody @Valid OrderDetail orderDetail, String id) {
            return ResponseEntity.ok(orderDetailService.updateOrder(orderDetail, id));
        }

}
