package com.example.SWP391.controller;


import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Status;
import com.example.SWP391.model.DTO.OrderDTO.OrderImageRequest;
import com.example.SWP391.model.DTO.OrderDTO.OrderRequest;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
import com.example.SWP391.model.Enum.OrderType;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.OrderDetailRepository;
import com.example.SWP391.service.OrderDetailService;
import com.example.SWP391.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "api")
@CrossOrigin("*")
public class OrdersAPI {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    ModelMapper modelMapper;

    @PostMapping("/api/orders")
    public ResponseEntity createOrder(@Valid @RequestBody OrderRequest orders) throws Exception {
        return ResponseEntity.ok(orderService.createOrder(orders));
    }

    @PostMapping("/api/orders/create-from-json")
    public ResponseEntity<String> createOrdersFromJson(@RequestBody String jsonArray) {
        try {
            orderService.createOrdersFromJson(jsonArray);
            return ResponseEntity.ok("Orders created successfully");
        } catch (Exception e) {

            return ResponseEntity.status(500).body("Failed to create orders from JSON array");
        }
    }

    @GetMapping("/api/orders")
    public ResponseEntity getAllOrders(@RequestParam int page, @RequestParam int size) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size));
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity getLicenseById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.viewOrderById(id));
    }

    @GetMapping("/api/orders/status")
    public ResponseEntity getOrderByStatus(@RequestParam(name = "status") StatusInfo status) {

        List<Orders> orders = orderService.viewOrderByStatus(status);
        List<OrderResponse> orderResponses = orders.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            orderResponse.setPayment(order.getPayment().getStatus());
            orderResponse.setType(orderDetailService.viewOrderDetailById(order.getOrderID()).getType().toString());
            return orderResponse;
        }).toList();
        return ResponseEntity.ok(orderResponses);
    }

    @GetMapping("/api/orders/status-type")
    public ResponseEntity getOrderByStatusAndType(@RequestParam(name = "status") StatusInfo status, @RequestParam(name = "type") OrderType type) {
        return ResponseEntity.ok(orderService.viewOrderByStatusAndType(status, type));
    }

    @GetMapping("/api/orders/status-emp")
    public ResponseEntity getOrderByStatusAndEmpId(@RequestParam(name = "status") StatusInfo status, @RequestParam(name = "empId") String empId) {
        System.out.println(status);
        System.out.println(empId);
        return ResponseEntity.ok(orderService.viewOrderByStatusAndEmpId(status, empId));
    }

    @GetMapping("/api/orders/type")
    public ResponseEntity getOrderByType(@RequestParam(name = "type") OrderType type) {
        return ResponseEntity.ok(orderService.viewOrderByOrderType(type));
    }

    @GetMapping("/api/orders/status-emp-total")
    public ResponseEntity getOrderByStatusAndEmpIdAndTotal(@RequestParam(name = "status") StatusInfo status, @RequestParam(name = "empId") String empId) {
        return ResponseEntity.ok(orderService.viewOrderByStatusAndEmpIdAndTotal(status, empId));
    }

    @GetMapping("/api/orders/total")
    public ResponseEntity getOrderTotalByUsername(@RequestParam(name = "status") StatusInfo status, @RequestParam(name = "empUsername") String username) {
        return ResponseEntity.ok(orderService.getTotalByEmpUsername(status, username));
    }

    @GetMapping("/api/orders/account")
    public ResponseEntity getOrderByAccount(@RequestParam String username) {
        return ResponseEntity.ok(orderService.viewOrderByAccount(username));
    }

    @GetMapping("/api/orders/responsible")
    public ResponseEntity getOrderResponsible(@RequestParam String orderId) {
        return ResponseEntity.ok(orderService.viewOrderResponsible(orderId));
    }

    @GetMapping("api/orders/waiting-for-2nd-staff")
    public ResponseEntity getWaitingFor2ndStaff(@RequestParam String empId) {
        return ResponseEntity.ok(orderService.getAccWait2nd(empId));
    }

    @GetMapping("/api/orders/oversea")
    public ResponseEntity getOverseaOrder(@RequestParam String empId, @RequestParam StatusInfo status) {
        return ResponseEntity.ok(orderService.viewOrderOversea(empId, status));
    }

    @PutMapping("/api/orders/{id}")
    public ResponseEntity updateOrder(@RequestBody @Valid OrderRequest order, @PathVariable String id) {
        return ResponseEntity.ok(orderService.updateOrder(order, id));
    }

    @PutMapping("/api/orders/image")
    public ResponseEntity updateImage(@RequestBody OrderImageRequest orderImageRequest) {
        return ResponseEntity.ok(orderService.updateImage(orderImageRequest));
    }

    @PutMapping("/api/orders/finish-image")
    public ResponseEntity updateFinishImage(@RequestBody OrderImageRequest orderImageRequest) {
        return ResponseEntity.ok(orderService.updateFinishImage(orderImageRequest));
    }

    @PutMapping("/api/orders/refund")
    public ResponseEntity updateReFund(@RequestParam String orderId) {
        return ResponseEntity.ok(orderService.updateRefund(orderId));
    }

    @DeleteMapping("/api/orders/{id}")
    public ResponseEntity deleteOrder(@PathVariable String id) {
        return ResponseEntity.ok(orderService.deleteOrder(id));
    }
}
