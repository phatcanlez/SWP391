package com.example.SWP391.service;


import com.example.SWP391.entity.Account;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.EmailDetail;
import com.example.SWP391.model.DTO.OrderDTO.OrderRequest;
import com.example.SWP391.model.DTO.authenticatonDTO.*;
import com.example.SWP391.model.DTO.forgotPassword.ForgotPasswordRequest;
import com.example.SWP391.model.DTO.forgotPassword.ResetPasswordRequest;
import com.example.SWP391.model.Enum.Role;
import com.example.SWP391.repository.AccountRepository;
import com.example.SWP391.util.TrackingUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
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
            emailDetail.setLink("http//koikichi.io.vn/");
            emailDetail.setContent("With a team of experienced experts, we are committed to transporting your Koi fish in the safest and most thoughtful way. Visit our website to discover more services and special offers for you.");
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
        log.info("login service");
        try {

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword())); //kh có thì catch exception
            Account account = (Account) authentication.getPrincipal(); //lấy thông tin ng dùng và cast về account
            AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
            accountResponse.setToken(tokenService.generateToken(account));
            accountResponse.setCountry(TrackingUtil.getCountry(account.getAddress()));
            return accountResponse;
        } catch (Exception e) {

            //error => throw new exception
            e.printStackTrace();
            throw new NotFoundException("Email or Password is invalid!!");
        }

    }

    public void createAccountsFromJson(String jsonArray) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<RegisterRequest> login = objectMapper.readValue(jsonArray, objectMapper.getTypeFactory().constructCollectionType(List.class, RegisterRequest.class));
            for (RegisterRequest acc : login) {
                register(acc);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create Account from JSON array", e);
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
//                EmailDetail emailDetail = new EmailDetail();
//                emailDetail.setReceiver(account);
//                emailDetail.setSubject("Welcome to KOIKICHI");
//                emailDetail.setContent("With a team of experienced experts, we are committed to transporting your Koi fish in the safest and most thoughtful way. Visit our website to discover more services and special offers for you.");
//                emailDetail.setLink("http//koikichi.io.vn/");
//                emailDetail.setButton("Go to home page");
//                emailService.sendEmail(emailDetail);
            }
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    oAuth.getEmail(),
                    oAuth.getUid())); //kh có thì catch exception
            account = (Account) authentication.getPrincipal(); //lấy thông tin ng dùng và cast về account
            AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
            accountResponse.setToken(tokenService.generateToken(account));
//            accountResponse.setCountry(TrackingUtil.getCountry(account.getAddress()));
            return accountResponse;

        } catch (Exception e) {
            //error => throw new exception
            e.printStackTrace();
            throw new NotFoundException("Email or Password is invalid!!");
        }
    }

    public AccountResponsePage getAllAccounts(int page, int size) {
        Page<Account> accounts = accountRepository.findAll(PageRequest.of(page,size)); // findAll() lấy tất cả account trong DB
        AccountResponsePage accountResponsePage = new AccountResponsePage();
        accountResponsePage.setContent(accounts.getContent());
        accountResponsePage.setPageNumbers(accounts.getNumber());
        accountResponsePage.setNummberOfElement(accounts.getNumberOfElements());
        accountResponsePage.setTotalElements(accounts.getTotalElements());
        accountResponsePage.setTotalPages(accounts.getTotalPages());
        return accountResponsePage;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUsername(username);
    }

    public Account updateAccount(String id, UpdateAccountRequest updatedAccount) {
        try {
            return accountRepository.findById(id).map(account -> {
                account.setName(updatedAccount.getName());
                account.setEmail(updatedAccount.getEmail());
                account.setAvatar(updatedAccount.getAvatar());
                account.setStatus(updatedAccount.isStatus());
                account.setPhoneNumber(updatedAccount.getPhoneNumber());
                account.setAddress(updatedAccount.getAddress());
                return accountRepository.save(account);
            }).orElseThrow(() -> new RuntimeException("Account not found with id " + id));
        } catch (Exception e) {
            throw new DuplicateException(e.getMessage());
        }

    }

    public Account updateAccountByManage(UpdateAccountRequestByManager updatedAccount) {
        try {
            return accountRepository.findById(updatedAccount.getId()).map(account -> {
                if (updatedAccount.getRole() != null) {
                    account.setRole(updatedAccount.getRole());
                }
                if (updatedAccount.getRole() != null) {
                    account.setRole(updatedAccount.getRole());
                }
                if (updatedAccount.getName() != null) {
                    account.setName(updatedAccount.getName());
                }
                if (updatedAccount.getEmail() != null) {
                    account.setEmail(updatedAccount.getEmail());
                }
                if (updatedAccount.getAvatar() != null) {
                    account.setAvatar(updatedAccount.getAvatar());
                }
                if (updatedAccount.getStatus() != null) {
                    account.setStatus(Boolean.parseBoolean(updatedAccount.getStatus()));
                }
                if (updatedAccount.getPhoneNumber() != null) {
                    account.setPhoneNumber(updatedAccount.getPhoneNumber());
                }
                if (updatedAccount.getAddress() != null) {
                    account.setAddress(updatedAccount.getAddress());
                }

                return accountRepository.save(account);
            }).orElseThrow(() -> new RuntimeException("Account not found with id " + updatedAccount.getId()));
        } catch (Exception e) {
            throw new DuplicateException(e.getMessage());
        }

    }


    public Account getAccountById(String id) {
        return accountRepository.findAccountById(id);
    }

    public Account getCurrentAccount(){
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return accountRepository.findAccountById(account.getId());
    }

    public void forgotPassword(ForgotPasswordRequest forgotPassword){
        Account account = accountRepository.findAccountByEmail(forgotPassword.getEmail());
        if(account == null){
            throw new NotFoundException("Account not found");
        }
        else{
            EmailDetail emailDetail = new EmailDetail();
            emailDetail.setReceiver(account);
            emailDetail.setSubject("Reset Your Password");
            emailDetail.setLink("https://www.google.com/?token=" + tokenService.generateToken(account));
            emailDetail.setContent("Click the link below to reset your password, if you did not request a password reset, please ignore this email.");
            emailDetail.setButton("Reset Password");
            emailService.sendEmail(emailDetail);
        }
    }

    public void resetPassword(ResetPasswordRequest request){
        Account account = getCurrentAccount();
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        accountRepository.save(account);
    }
}

