package com.example.SWP391.repository;

import com.example.SWP391.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Orders, String> {
    Orders findOrderByOrderID(String id);
}
