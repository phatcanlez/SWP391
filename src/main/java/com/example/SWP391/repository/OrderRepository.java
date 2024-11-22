package com.example.SWP391.repository;

import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Orders;
import com.example.SWP391.model.Enum.StatusInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface OrderRepository extends JpaRepository<Orders, String> {
    Orders findByorderID(String id);
    Page<Orders> findAll(Pageable pageable);;
    List<Orders> findByAccount(Account account);

    @Query("SELECT COUNT(o), MONTH(s.date) as month, YEAR(s.date) FROM Orders o JOIN o.status s WHERE s.statusInfo = 'SUCCESS' GROUP BY MONTH(s.date), YEAR(s.date) ORDER BY MONTH(s.date)")
    List<Object[]> getTotalsOrderSuccessByMonth();

    @Query("SELECT COUNT(o.orderID), MONTH(o.expDeliveryDate), YEAR(o.expDeliveryDate) " +
            "FROM Orders o " +
            "GROUP BY MONTH(o.expDeliveryDate), YEAR(o.expDeliveryDate) ORDER BY MONTH(o.expDeliveryDate)")
    List<Object[]> getTotalsOrderByMonth();

    @Query("SELECT COUNT(o), MONTH(s.date), YEAR(s.date) as month FROM Orders o JOIN o.status s WHERE s.statusInfo = 'FAIL' GROUP BY MONTH(s.date), YEAR(s.date) ORDER BY MONTH(s.date)")
    List<Object[]> getTotalsOrderFailByMonth();

}
