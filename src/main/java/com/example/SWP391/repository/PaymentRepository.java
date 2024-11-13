package com.example.SWP391.repository;

import com.example.SWP391.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findPaymentByPaymentId(long id);
    Payment findPaymentByOrdersOrderID(String id);

//    @Query("SELECT SUM(p.totalPrice), Year(p.timeOfPay), MONTH(p.timeOfPay),  Week(p.timeOfPay  FROM Payment p WHERE p.status = 'SUCCESS' " +
//            "group by MONTH(p.timeOfPay),  Week(p.timeOfPay) " +
//            "order by MONTH(p.timeOfPay), Week(p.timeOfPay)")

    @Query("SELECT SUM(o.totalPrice), YEAR(p.timeOfPay), MONTH(p.timeOfPay) " +
            "FROM Payment p JOIN p.orders o WHERE p.status = 'SUCCESS' " +
            "GROUP BY YEAR(p.timeOfPay), MONTH(p.timeOfPay)")
    List<Object[]> calculateMonthlyRevenueByYear();
}
