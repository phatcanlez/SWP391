package com.example.SWP391.Service;

import com.example.SWP391.entity.Customer;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.model.DTO.CustomerAccResponse;
import com.example.SWP391.repository.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    public CustomerAccResponse createCustomer(Customer customer) {
        try {
            customer.setPassword(passwordEncoder.encode(customer.getPassword()));
            Customer cus = customerRepository.save(customer);
            CustomerAccResponse cusAcc = modelMapper.map(cus, CustomerAccResponse.class);
            return cusAcc;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public Customer viewAccount(String id){
        Customer customer = customerRepository.findCustomerById(id);
        if(customer == null){
            throw new DuplicateException("Not found");
        }
        else{
            return customer;
        }
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
