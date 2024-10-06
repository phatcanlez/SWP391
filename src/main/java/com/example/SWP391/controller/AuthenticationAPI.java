package com.example.SWP391.controller;

import com.example.SWP391.model.DTO.CustomerResponse;
import com.example.SWP391.model.DTO.LoginRequest;
import com.example.SWP391.model.DTO.RegisterRequest;
import com.example.SWP391.service.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*") //cho phép tất cả code truy cập
@SecurityRequirement(name = "api") //bắt buộc có, nên nhớ
public class AuthenticationAPI {

    //DI: Dependency Injection
    @Autowired
    AuthenticationService authenticationService;   //tương tự new package: AuthenticationService a = new AuthenticationService();
    @PostMapping("/api/register")
    public ResponseEntity register(@RequestBody @Valid RegisterRequest registerRequest) {
        //api nhận request và object từ FE, sau đó nhờ service xử lý, thông qua lớp authenticationService
        //bản chất API là chỉ nhận request và response
        CustomerResponse newCustomerResponse = authenticationService.register(registerRequest);
        return ResponseEntity.ok(newCustomerResponse);
    }

    LoginRequest loginRequest;
    @PostMapping("/api/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest)
    {
        CustomerResponse a = authenticationService.login(loginRequest);
        return ResponseEntity.ok(a);
    }

}