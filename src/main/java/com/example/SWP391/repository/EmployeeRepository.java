package com.example.SWP391.repository;


import com.example.SWP391.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Employee findEmployeeById(String id);
}
