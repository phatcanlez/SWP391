package com.example.SWP391.repository;

import com.example.SWP391.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String>{
    Customer findCustomerById(String id);
}
