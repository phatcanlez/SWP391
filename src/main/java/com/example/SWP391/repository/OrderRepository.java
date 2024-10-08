package com.example.SWP391.repository;

import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OrderRepository extends JpaRepository<Orders, String> {
    Orders findByorderID(String id);
    List<Orders> findByAccount(Account account);
}
