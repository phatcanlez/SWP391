package com.example.SWP391.controller;

import com.example.SWP391.entity.OrderDetail;
import com.example.SWP391.model.DTO.OrderDetailDTO.OrderDetailRequest;
import com.example.SWP391.service.OrderDetailService;
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
        public ResponseEntity createOrderDetail(@Valid @RequestBody OrderDetailRequest orderDetail) {
            return ResponseEntity.ok(orderDetailService.createOrderDetail(orderDetail));
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
        public ResponseEntity updateLicense(@RequestBody @Valid OrderDetailRequest orderDetail, String id) {
            return ResponseEntity.ok(orderDetailService.updateOrderDetail(orderDetail, id));
        }

}
