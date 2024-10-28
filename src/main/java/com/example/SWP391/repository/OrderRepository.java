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

    @Query("SELECT COUNT(o), MONTH(s.date) as month FROM Orders o JOIN o.status s WHERE s.statusInfo = 'SUCCESS' GROUP BY MONTH(s.date) ORDER BY MONTH(s.date)")
    List<Object[]> getTotalsOrderSuccessByMonth();

    @Query("SELECT COUNT(o), MONTH(s.date) as month FROM Orders o JOIN o.status s WHERE s.statusInfo = 'WAITING' GROUP BY MONTH(s.date) ORDER BY MONTH(s.date)")
    List<Object[]> getTotalsOrderByMonth();

    @Query("SELECT COUNT(o), MONTH(s.date) as month FROM Orders o JOIN o.status s WHERE s.statusInfo = 'FAIL' GROUP BY MONTH(s.date) ORDER BY MONTH(s.date)")
    List<Object[]> getTotalsOrderFailByMonth();
}
