package com.example.SWP391.service;

import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Status;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.repository.StatusRepository;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    StatusRepository statusRepository;

    public List<Orders> getAllOrders(){
        List<Orders> list = orderRepository.findAll();
        return list;
    }

    public Orders createOrder(Orders order) {
        try {
            // Save the Status entity first
            Status status = order.getStatusInfo();
            if (status != null && status.getId() == 0) {
                status = statusRepository.save(status);
                order.setStatusInfo(status);
            }
            return orderRepository.save(order);
        } catch (Exception e) {
            e.printStackTrace();
            throw new DuplicateException("Unexpected error!");
        }
    }

    public Orders viewOrderById(long id){
        Orders order = orderRepository.findById(id);
        if(order == null){
            throw new NotFoundException("Not found this order");
        }
        else{
            return order;
        }
    }

    public Orders updateOrder(Orders order, long id){
        Orders existingOrder = orderRepository.findById(id);
        if(existingOrder == null){
            throw new NotFoundException("Not found!");
        }
        try {
            // Save the Status entity first
            Status status = order.getStatusInfo();
            if (status != null && status.getId() == 0) {
                status = statusRepository.save(status);
                order.setStatusInfo(status);
            }
            existingOrder.setOrderDate(order.getOrderDate());
            existingOrder.setReciverAdress(order.getReciverAdress());
            existingOrder.setExpDeliveryDate(order.getExpDeliveryDate());
            existingOrder.setActDeliveryDate(order.getActDeliveryDate());
            existingOrder.setReciverName(order.getReciverName());
            existingOrder.setNote(order.getNote());
            existingOrder.setReciverPhoneNumber(order.getReciverPhoneNumber());
            existingOrder.setOrderPrice(order.getOrderPrice());
            existingOrder.setStatusInfo(order.getStatusInfo());
            return orderRepository.save(existingOrder);
        } catch (Exception e) {
            throw new DuplicateException("Unexpected error!");
        }
    }
}
