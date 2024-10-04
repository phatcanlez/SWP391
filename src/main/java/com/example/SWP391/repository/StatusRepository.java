package com.example.SWP391.repository;

import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status, Long> {
    Status findById(long id);
}
