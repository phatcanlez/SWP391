package com.example.SWP391.service;

import com.example.SWP391.entity.*;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.OrderDTO.OrderRequest;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
import com.example.SWP391.model.Enum.Paystatus;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.AccountRepository;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.repository.PaymentRepository;
import com.example.SWP391.repository.StatusRepository;
import com.example.SWP391.util.DateConversionUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    StatusRepository statusRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    PaymentRepository paymentRepository;

    public List<OrderResponse> getAllOrders() {
        List<Orders> list = orderRepository.findAll();
        return list.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            return orderResponse;
        }).toList();
    }

    public OrderResponse createOrder(OrderRequest order) {
        try {
            Orders newOrder = modelMapper.map(order, Orders.class);
            Account account = accountRepository.findByUsername(order.getUsername());
            newOrder.setAccount(account);
            Status status = new Status();
            status.setStatusInfo(StatusInfo.WAITING);
            status.setDate(DateConversionUtil.convertToDate(LocalDateTime.now()));
            status.setOrders(newOrder);
            status.setDescription("Waiting for confirmation");
            status.setEmpId("");
            newOrder.getStatus().add(status);
            Payment payment = new Payment();
            payment.setOrders(newOrder);
            payment.setStatus(Paystatus.UNPAYED.toString());
            paymentRepository.save(payment);
            orderRepository.save(newOrder);
            OrderResponse orderResponse = modelMapper.map(newOrder, OrderResponse.class);
            orderResponse.setStatus(newOrder.getStatus().getLast());
            return orderResponse;
        } catch (Exception e) {
            e.printStackTrace();
            throw new DuplicateException("Unexpected error!");
        }
    }

    public Orders viewOrderById(String id) {
        Orders order = orderRepository.findByorderID(id);
        if (order == null) {
            throw new NotFoundException("Not found this order");
        } else {
            return order;
        }
    }

    public Orders updateOrder (OrderRequest order,String id){
        Orders existingOrder = orderRepository.findByorderID(id);
        if (existingOrder == null) {
            throw new NotFoundException("Not found!");
        }
        try {
            existingOrder.setReciverAdress(order.getReciverAdress());
            existingOrder.setExpDeliveryDate(order.getExpDeliveryDate());
            existingOrder.setReciverName(order.getReciverName());
            existingOrder.setNote(order.getNote());
            existingOrder.setReciverPhoneNumber(order.getReciverPhoneNumber());
            existingOrder.setOrderPrice(order.getOrderPrice());
            return orderRepository.save(existingOrder);
        } catch (Exception e) {
            throw new DuplicateException("Unexpected error!");
        }
    }

    public List<OrderResponse> viewOrderByStatus(String status) {
        try {
            StatusInfo statusInfo = StatusInfo.valueOf(status);
            List<Status> statuses = statusRepository.findByStatusInfo(statusInfo);
            List<Orders> list = new ArrayList<>();
            for (Status s : statuses) {
                list.add(s.getOrders());
            }
            return list.stream().map(order -> {
                OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
                orderResponse.setStatus(order.getStatus().getLast());
                return orderResponse;
            }).toList();
        } catch (Exception e) {
            throw new NotFoundException("Error");
        }
    }

    public List<OrderResponse> viewOrderByAccount(String username) {
        try {
            Account account = accountRepository.findByUsername(username);
            List<Orders> list = orderRepository.findByAccount(account);
            return list.stream().map(order -> {
                OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
                orderResponse.setStatus(order.getStatus().getLast());
                return orderResponse;
            }).toList();
        } catch (Exception e) {
            throw new NotFoundException("Error");
        }
    }
}

