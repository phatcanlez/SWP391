package com.example.SWP391.controller;

import com.example.SWP391.entity.Account;
import com.example.SWP391.model.DTO.authenticatonDTO.*;
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
        log.info("login api");
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
    public ResponseEntity getAllAccounts(@RequestParam int page, @RequestParam int size) {
        return ResponseEntity.ok(authenticationService.getAllAccounts(page, size));
    }

    @PostMapping("/api/account/create-from-json")
    public ResponseEntity<String> createOrdersFromJson(@RequestBody String jsonArray) {
        try {
            authenticationService.createAccountsFromJson(jsonArray);
            return ResponseEntity.ok("Orders created successfully");
        } catch (Exception e) {

            return ResponseEntity.status(500).body("Failed to create account from JSON array");
        }
    }

    @PutMapping("/api/account/{id}")
    public ResponseEntity updateAccount(@RequestBody @Valid UpdateAccountRequest updateAccountRequest, @PathVariable String id) {
        return ResponseEntity.ok(authenticationService.updateAccount(id, updateAccountRequest));
    }

    @GetMapping("/api/account/{id}")
    public ResponseEntity getAccountById(@PathVariable String id) {
        return ResponseEntity.ok(authenticationService.getAccountById(id));
    }

    @PostMapping("/api/forgot-password")
    public ResponseEntity forgotPassword(@RequestBody @Valid ForgotPasswordRequest forgotPasswordRequest) {
        authenticationService.forgotPassword(forgotPasswordRequest);
        return ResponseEntity.ok("Email sent");
    }

    @PostMapping("/api/reset-password")
    public ResponseEntity resetPassword(@RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }

}