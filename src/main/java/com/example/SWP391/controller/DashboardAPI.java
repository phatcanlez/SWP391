package com.example.SWP391.controller;

import com.example.SWP391.service.DashboardService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*") //cho phép tất cả code truy cập
@SecurityRequirement(name = "api") //bắt buộc có, nên nhớ
public class DashboardAPI {

    @Autowired
    DashboardService dashboardService;

    @GetMapping("/api/dashboard")
    public ResponseEntity getDashboardStats(){
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/api/dashboard-payment-revenue")
    public ResponseEntity getPaymentRevenue(){
        return ResponseEntity.ok(dashboardService.caculateMonthlyRevenue());
    }

    @GetMapping("/api/dashboard-total-order")
    public ResponseEntity getTotalOrder(){
        return ResponseEntity.ok(dashboardService.getOrderByMonth());
    }

    @GetMapping("/api/dashboard-order-success")
    public ResponseEntity getTotalOrderSuccess(){
        return ResponseEntity.ok(dashboardService.orderSuccessByMonth());
    }

    @GetMapping("/api/dashboard-order-fail")
    public ResponseEntity getTotalOrderFail(){
        return ResponseEntity.ok(dashboardService.getOrderFailByMonth());
    }
}
