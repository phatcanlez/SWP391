package com.example.SWP391.service;


import com.example.SWP391.entity.Account;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.EmailDetail;
import com.example.SWP391.model.DTO.authenticatonDTO.*;
import com.example.SWP391.model.DTO.authenticatonDTO.TokenService;
import com.example.SWP391.model.Enum.Role;
import com.example.SWP391.repository.AccountRepository;
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

import java.util.List;

@Service
public class AuthenticationService implements UserDetailsService {

    //xử lý logic, xử lý nghiệp vụ
    @Autowired
    AccountRepository accountRepository;


    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    TokenService tokenService;


    @Autowired
    EmailService emailService;

    public AccountResponse register(RegisterRequest registerRequest) {
        Account account = modelMapper.map(registerRequest, Account.class);
        try {
            String originPass = account.getPassword();
            account.setPassword(passwordEncoder.encode(originPass));
            account.setStatus(true);
            Account newAccount = accountRepository.save(account);
            //đăng ký thành công, gửi mail cho người dùng
            EmailDetail emailDetail = new EmailDetail();
            emailDetail.setReceiver(newAccount);
            emailDetail.setSubject("Welcome to KOIKICHI");
            emailDetail.setLink("https://www.google.com.vn/");
            emailService.sendEmail(emailDetail);
            return modelMapper.map(newAccount, AccountResponse.class);
        } catch (Exception e) {

            if (e.getMessage().contains(account.getEmail())) {
                throw new DuplicateException("Duplicated Email! Created Fail");
            } else if (e.getMessage().contains(account.getUsername())) {
                throw new DuplicateException("Duplicated Username! Created Fail");
            }else {
                System.out.println(e.getMessage());
                throw new DuplicateException(e.getMessage());
            }


        }
        // tương tự context.add C#
    }

    public AccountResponse login(LoginRequest loginRequest) {
        try {

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword())); //kh có thì catch exception
            Account account = (Account) authentication.getPrincipal(); //lấy thông tin ng dùng và cast về account
            AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
            accountResponse.setToken(tokenService.generateToken(account));
            return accountResponse;
        } catch (Exception e) {

            //error => throw new exception
            throw new NotFoundException("Email or Password is invalid!!");
        }

    }

    public AccountResponse loginGoogle(OAuth oAuth) {
        Account account = modelMapper.map(oAuth, Account.class);
        try {
            Account acc = accountRepository.findByUsername(oAuth.getEmail());
            if (acc == null) {
                account.setPassword(oAuth.getUid());
                String originPass = account.getPassword();
                account.setPassword(passwordEncoder.encode(originPass));
                account.setUsername(oAuth.getEmail());
                account.setRole(Role.CUSTOMER);
                account.setAvatar(oAuth.getAvatar());
                account.setStatus(true);
                accountRepository.save(account);
                //đăng ký thành công, gửi mail cho người dùng
                EmailDetail emailDetail = new EmailDetail();
                emailDetail.setReceiver(account);
                emailDetail.setSubject("Welcome to KOIKICHI");
                emailDetail.setLink("https://www.google.com.vn/");
                emailService.sendEmail(emailDetail);
            }
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    oAuth.getEmail(),
                    oAuth.getUid())); //kh có thì catch exception
            account = (Account) authentication.getPrincipal(); //lấy thông tin ng dùng và cast về account
            AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
            accountResponse.setToken(tokenService.generateToken(account));
            return accountResponse;

        } catch (Exception e) {
            //error => throw new exception
            throw new NotFoundException("Email or Password is invalid!!");
        }
    }

    public List<Account> getAllAccounts() {
        List<Account> list = accountRepository.findAll(); // findAll() lấy tất cả account trong DB
        return list;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUsername(username);
    }
}

