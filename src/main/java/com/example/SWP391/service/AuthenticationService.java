package com.example.SWP391.service;

import com.example.SWP391.entity.Customer;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.CustomerResponse;
import com.example.SWP391.model.DTO.LoginRequest;
import com.example.SWP391.model.DTO.RegisterRequest;
import com.example.SWP391.repository.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements UserDetailsService {
    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    TokenService tokenService;

    public CustomerResponse register(RegisterRequest registerRequest){
        Customer customer = modelMapper.map(registerRequest, Customer.class);
        try{
            customer.setStatus(true);
            String originPass = customer.getPassword();
            customer.setPassword(passwordEncoder.encode(originPass));
            Customer newAccount = customerRepository.save(customer);
            return modelMapper.map(newAccount, CustomerResponse.class);
        } catch (Exception e) {
            if(e.getMessage().contains(customer.getEmail()))
            {
                throw new DuplicateException("Duplicated Email! Created Fail");
            }
            else if(e.getMessage().contains(customer.getPhoneNumber())){
                throw new DuplicateException("Duplicated Phone! Created Fail");
            }
            else{
                throw new DuplicateException("UnExpected Error");
            }


        }
    }

    public CustomerResponse login(LoginRequest loginRequest){
        try {

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword())); //kh có thì catch exception
            Customer customer = (Customer) authentication.getPrincipal(); //lấy thông tin ng dùng và cast về account
            CustomerResponse accountResponse = modelMapper.map(customer, CustomerResponse.class);
            accountResponse.setToken(tokenService.generateToken(customer));
            return accountResponse;
        }catch (Exception e){
            //error => throw new exception
            throw new NotFoundException("Email or Password is invalid!!");
        }

    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return customerRepository.findCustomerByEmail(email);
    }
}
