package com.example.SWP391.repository;

import com.example.SWP391.entity.OrderDetail;
import com.example.SWP391.model.Enum.OrderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, String> {
    @Query("SELECT od FROM OrderDetail od WHERE od.orders.orderID = :orderID")
    OrderDetail findOrderDetailByOrdersOrderID(@Param("orderID") String orderID);
    List<OrderDetail> findOrderDetailByType(OrderType type);
}
