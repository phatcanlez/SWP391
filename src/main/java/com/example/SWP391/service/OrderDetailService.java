package com.example.SWP391.service;

import com.example.SWP391.entity.OrderDetail;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {
    @Autowired
    OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> getAllOrdersDetail() {
       List<OrderDetail> list = orderDetailRepository.findAll();
        return list;
    }

    public OrderDetail createOrder(OrderDetail orderDetail) {
        try {
            return orderDetailRepository.save(orderDetail);
        } catch (Exception e) {
            e.printStackTrace();
            throw new DuplicateException("Unexpected error!");
        }
    }

        public OrderDetail viewOrderDetailById(String id) {
            OrderDetail orderDetail = orderDetailRepository.findOrderDetailByOrdDetailId(id);
            if (orderDetail == null) {
                throw new NotFoundException("Not found this order");
            } else {
                return orderDetail;
            }
        }


        public OrderDetail updateOrder (OrderDetail orderDetail,String id){
            OrderDetail existingOrder = orderDetailRepository.findOrderDetailByOrdDetailId(id);
            if (existingOrder == null) {
                throw new NotFoundException("Not found!");
            }
            try {
                existingOrder.setKilometer(orderDetail.getKilometer());
                existingOrder.setSmallBox(orderDetail.getSmallBox());
                existingOrder.setMediumBox(orderDetail.getMediumBox());
                existingOrder.setLargeBox(orderDetail.getLargeBox());
                existingOrder.setExtraLargeBox(orderDetail.getExtraLargeBox());
                existingOrder.setBoxPrice(orderDetail.getBoxPrice());
                return orderDetailRepository.save(existingOrder);
            } catch (Exception e) {
                throw new DuplicateException("Unexpected error!");
            }
        }
    }

