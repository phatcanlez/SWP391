package com.example.SWP391.repository;

import com.example.SWP391.entity.OrderDetail;
import com.example.SWP391.model.Enum.OrderType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, String> {
    OrderDetail findOrderDetailByOrdersOrderID(String id);
    List<OrderDetail> findOrderDetailByType(OrderType type);
}
