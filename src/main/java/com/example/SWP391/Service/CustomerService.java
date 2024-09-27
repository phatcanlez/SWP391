package com.example.SWP391.service;

import com.example.SWP391.entity.Customer;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.model.DTO.CustomerAccResponse;
import com.example.SWP391.repository.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    public Customer createCustomer(Customer customer) {
        Customer newStudent = customerRepository.save(customer);
        return newStudent;
    }

    public Customer viewAccountById(String id){
        Customer customer = customerRepository.findCustomerById(id);
        if(customer == null){
            throw new DuplicateException("Not found");
        }
        else{
            return customer;
        }
    }

    public List<Customer> viewAccount(){
        List<Customer> list = customerRepository.findAll();
        if(list == null){
            throw new DuplicateException("Not found");
        }
        return list;
    }

    public Customer updateAccount(Customer cus, String id) {
        Customer oldCustomer = customerRepository.findCustomerById(id);
          if (oldCustomer == null)
              throw new DuplicateException("Not found");
        try {
              oldCustomer.setPassword(cus.getPassword());
              oldCustomer.setAddress(cus.getAddress());
              oldCustomer.setName(cus.getName());
              return customerRepository.save(oldCustomer);
      } catch (Exception e) {
          throw new DuplicateException("Duplicated info");
      }

    }
}
