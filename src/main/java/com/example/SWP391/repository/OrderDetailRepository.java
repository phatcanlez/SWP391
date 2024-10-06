package com.example.SWP391.repository;

import com.example.SWP391.entity.OrderDetail;
import com.example.SWP391.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, String> {
    OrderDetail findOrderDetailByOrdDetailId(String id);
}
