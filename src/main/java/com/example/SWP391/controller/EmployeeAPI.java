package com.example.SWP391.controller;

import com.example.SWP391.entity.Employee;
import com.example.SWP391.model.DTO.employeeDTO.EmployeeRequest;
import com.example.SWP391.model.DTO.employeeDTO.EmployeeRequestUpdate;
import com.example.SWP391.model.DTO.employeeDTO.EmployeeResponese;
import com.example.SWP391.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")

public class EmployeeAPI {
    @Autowired
    EmployeeService employeeService;

    @PostMapping("/api/employee")
    public ResponseEntity createEmployee(@RequestBody @Valid EmployeeRequest employee) {
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @GetMapping("/api/employee/{id}")
    public ResponseEntity viewEmployById(@PathVariable String id){
        EmployeeResponese employeeResponese = employeeService.viewEmployeeById(id);
        return ResponseEntity.ok(employeeResponese);
    }

    @GetMapping("/api/employee/")
    public ResponseEntity getEmploys(){
        List<EmployeeResponese> employeeResponese = employeeService.getEmployees();
        return ResponseEntity.ok(employeeResponese);
    }

    @PutMapping("/api/employee/{id}")
    public ResponseEntity getEmploys(@RequestBody @Valid EmployeeRequestUpdate employeeRequestUpdate, @PathVariable String id){

        return ResponseEntity.ok(employeeService.updateAccount(employeeRequestUpdate,id));
    }
}
