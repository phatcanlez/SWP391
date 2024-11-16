package com.example.SWP391.util;

import com.example.SWP391.entity.Account;
import com.example.SWP391.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AccountUtils {
    @Autowired
    AccountRepository userRepository;

    public Account getCurrentUser(){
        String userName =  SecurityContextHolder.getContext().getAuthentication().getName();
        Account user = userRepository.findByUsername(userName);
        return user;
    }
}