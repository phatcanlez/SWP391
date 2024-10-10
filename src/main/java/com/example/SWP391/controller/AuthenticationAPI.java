package com.example.SWP391.controller;

import com.example.SWP391.entity.Account;

import com.example.SWP391.model.DTO.authenticatonDTO.AccountResponse;
import com.example.SWP391.model.DTO.authenticatonDTO.LoginRequest;
import com.example.SWP391.model.DTO.authenticatonDTO.RegisterRequest;
import com.example.SWP391.model.DTO.forgotPassword.ForgotPasswordRequest;
import com.example.SWP391.model.DTO.forgotPassword.ResetPasswordRequest;
import com.example.SWP391.service.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@CrossOrigin("*") //cho phép tất cả code truy cập
@SecurityRequirement(name = "api") //bắt buộc có, nên nhớ
public class AuthenticationAPI {

    @Autowired
    AuthenticationService authenticationService;   //tương tự new package: AuthenticationService a = new AuthenticationService();

    @PostMapping("/api/register")
    public ResponseEntity register(@RequestBody @Valid RegisterRequest registerRequest) {
        //api nhận request và object từ FE, sau đó nhờ service xử lý, thông qua lớp authenticationService
        //bản chất API là chỉ nhận request và response
        AccountResponse newAccount = authenticationService.register(registerRequest);
        return ResponseEntity.ok(newAccount);
    }


    @PostMapping("/api/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest)
    {
        log.info("loginAPI");
        AccountResponse a = authenticationService.login(loginRequest);
        return ResponseEntity.ok(a);
    }

    @PostMapping("/api/login/google")
    public ResponseEntity loginGoogle(@RequestBody OAuth loginRequest)
    {
        AccountResponse a = authenticationService.loginGoogle(loginRequest);
        return ResponseEntity.ok(a);
    }

    @GetMapping("/api/account")
    public ResponseEntity getAllAccounts() {
        List<Account> list = authenticationService.getAllAccounts();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/api/forgot-password")
    public ResponseEntity forgotPassword(@RequestBody @Valid ForgotPasswordRequest forgotPasswordRequest) {
        authenticationService.forgotPassword(forgotPasswordRequest);
        String notification = "Email sent";
        return ResponseEntity.ok(notification);
    }

//    @PostMapping("/api/reset-password")
//    public ResponseEntity resetPassword(@RequestBody ResetPasswordRequest request) {
//        authenticationService.resetPassword(request);
//        String notification = "Password reset successfully";
//        return ResponseEntity.ok(notification);
//    }

}