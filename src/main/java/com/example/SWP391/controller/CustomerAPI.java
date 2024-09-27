package com.example.SWP391.controller;

import com.example.SWP391.entity.License;
import com.example.SWP391.service.CustomerService;
import com.example.SWP391.entity.Customer;
import com.example.SWP391.model.DTO.CustomerAccResponse;
import com.example.SWP391.service.LicenseService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class CustomerAPI {

    @Autowired
    CustomerService customerService;

    @Autowired
    ModelMapper modelMapper;

    @PostMapping("api/customer")
    public ResponseEntity createCustomer(@Valid @RequestBody Customer customer) {
        try {
            Customer cus = customerService.createCustomer(customer);
            return ResponseEntity.ok(cus);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Duplicated info");
        }
    }

    @GetMapping("api/customer/{id}")
    public ResponseEntity viewCustomerById(@PathVariable String id) {
        Customer customer = customerService.viewAccountById(id);
        return ResponseEntity.ok(customer);
    }

    @GetMapping("api/customer")
    public ResponseEntity viewAllCustomer() {
        List<Customer> customer = customerService.viewAccount();
        return ResponseEntity.ok(customer);
    }

    @PutMapping("api/customer/{id}")
    public ResponseEntity updateCustomer(@Valid @RequestBody Customer cus, @PathVariable String id) {
        Customer a = customerService.updateAccount(cus,id);

        return ResponseEntity.ok(a);
    }

}
