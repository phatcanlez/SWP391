package com.example.SWP391.controller;

import com.example.SWP391.service.CustomerService;
import com.example.SWP391.entity.Customer;
import com.example.SWP391.model.DTO.CustomerAccResponse;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class CustomerAPI {

    @Autowired
    CustomerService customerService;

    @Autowired
    ModelMapper modelMapper;

    @PostMapping("api/customer")
    public ResponseEntity createCustomer(@Valid @RequestBody Customer customer) {
        CustomerAccResponse cus = customerService.createCustomer(customer);
        return ResponseEntity.ok(cus);
    }

    @GetMapping("api/customer/{id}")
    public ResponseEntity viewAccount(@PathVariable String id) {
        Customer customer = customerService.viewAccount(id);
        return ResponseEntity.ok(customer);
    }

//    @PutMapping("api/customer/{id}")
//    public ResponseEntity update(@Valid @RequestBody Customer cus, @PathVariable String id) {
//        Customer a = customerService.updateAccount(cus,id);
//
//        return ResponseEntity.ok(a);
//    }
}
