package com.example.SWP391.repository;

import com.example.SWP391.entity.Payment;
import com.example.SWP391.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findPaymentByPaymentId(long id);
}
