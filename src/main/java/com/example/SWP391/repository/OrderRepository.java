package com.example.SWP391.repository;

import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface OrderRepository extends JpaRepository<Orders, String> {
    Orders findByorderID(String id);
    Page<Orders> findAll(Pageable pageable);;
    List<Orders> findByAccount(Account account);

}
