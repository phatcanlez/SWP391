package com.example.SWP391.service;

import com.example.SWP391.entity.*;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.repository.PaymentRepository;
import com.example.SWP391.repository.StatusRepository;
import org.aspectj.weaver.ast.Or;
import org.hibernate.query.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    PaymentRepository paymentRepository;

    public List<Orders> getAllOrders() {
        List<Orders> list = orderRepository.findAll();
        return list;
    }

    public Orders createOrder(Orders order) {
        try {
            for (Status i : order.getStatus()) {
                i.setOrders(order);
            }
            for (License i : order.getLicenses()) {
                i.setOrders(order);
            }
            for (Report i : order.getReports()) {
                i.setOrders(order);
            }
            for (Feedback i : order.getFeedbacks()) {
                i.setOrders(order);
            }
            Payment payment = order.getPayment();
            payment.setOrders(order);

            return orderRepository.save(order);
        } catch (Exception e) {
            e.printStackTrace();
            throw new DuplicateException("Unexpected error!");
        }
    }

        public Orders viewOrderById(long id) {
            Orders order = orderRepository.findById(id);
            if (order == null) {
                throw new NotFoundException("Not found this order");
            } else {
                return order;
            }
        }

    public List<Orders> getAllOrder() {
        List<Orders> list = orderRepository.findAll();
        return list;
        }


        public Orders updateOrder (Orders order,long id){
            Orders existingOrder = orderRepository.findById(id);
            if (existingOrder == null) {
                throw new NotFoundException("Not found!");
            }
            try {
                existingOrder.setOrderDate(order.getOrderDate());
                existingOrder.setReciverAdress(order.getReciverAdress());
                existingOrder.setExpDeliveryDate(order.getExpDeliveryDate());
                existingOrder.setActDeliveryDate(order.getActDeliveryDate());
                existingOrder.setReciverName(order.getReciverName());
                existingOrder.setNote(order.getNote());
                existingOrder.setReciverPhoneNumber(order.getReciverPhoneNumber());
                existingOrder.setOrderPrice(order.getOrderPrice());
                return orderRepository.save(existingOrder);
            } catch (Exception e) {
                throw new DuplicateException("Unexpected error!");
            }
        }
    }

