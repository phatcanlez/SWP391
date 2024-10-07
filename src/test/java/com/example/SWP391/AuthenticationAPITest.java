package com.example.SWP391.controller;

import com.example.SWP391.model.DTO.authenticatonDTO.AccountResponse;
import com.example.SWP391.model.DTO.authenticatonDTO.LoginRequest;
import com.example.SWP391.model.DTO.authenticatonDTO.RegisterRequest;
import com.example.SWP391.service.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthenticationAPITest {

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private AuthenticationAPI authenticationAPI;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister() {
        RegisterRequest registerRequest = new RegisterRequest();
        AccountResponse mockResponse = new AccountResponse();
        mockResponse.setUsername("testuser");

        when(authenticationService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        ResponseEntity response = authenticationAPI.register(registerRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(mockResponse, response.getBody());
    }

    @Test
    void testLogin() {
        LoginRequest loginRequest = new LoginRequest();
        AccountResponse mockResponse = new AccountResponse();
        mockResponse.setToken("testToken");

        when(authenticationService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        ResponseEntity response = authenticationAPI.login(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(mockResponse, response.getBody());
    }
}

