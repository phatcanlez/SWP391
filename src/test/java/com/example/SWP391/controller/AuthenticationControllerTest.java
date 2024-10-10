package com.example.SWP391.controller;

import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.authenticatonDTO.AccountResponse;
import com.example.SWP391.model.DTO.authenticatonDTO.LoginRequest;
import com.example.SWP391.service.AuthenticationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationControllerTest {


    @Autowired  
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationService authenticationService;

    @MockBean
    private Authentication authentication;

    private LoginRequest loginRequest;
    private ResponseEntity responseEntity;
    private AccountResponse accountResponse;

    @BeforeEach
    public void initData(){
       loginRequest = new LoginRequest();
       loginRequest.setUsername("quoc");
       loginRequest.setPassword("123456");

       accountResponse = new AccountResponse();
       accountResponse.setUsername("quoc");
       accountResponse.setToken("dummyToken");


    }


    @Test
    void login_validRequest_success() throws Exception {
        // GIVEN
        ObjectMapper objectMapper = new ObjectMapper();
        String content = objectMapper.writeValueAsString(loginRequest); //convert object to json

        Mockito.when(authenticationService.login(ArgumentMatchers.any())).thenReturn(accountResponse);
        // WHEN, THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                .contentType(MediaType.APPLICATION_JSON) //set content type
                .content(content)) //set body
                .andExpect(MockMvcResultMatchers.status().isOk()) //expect status, dùng MockMvcResultMatchers để kiểm tra kết quả mong đợi là 200
                .andExpect(MockMvcResultMatchers.jsonPath("username").value("quoc"))
                .andExpect(MockMvcResultMatchers.jsonPath("token").value("dummyToken"));//kiểm tra response có chứa username = quoc không
    }

    @Test
    void login_invalidPassword_failure() throws Exception {
        // GIVEN
        loginRequest.setPassword("wrongpassword");
        ObjectMapper objectMapper = new ObjectMapper();
        String content = objectMapper.writeValueAsString(loginRequest);

        Mockito.when(authenticationService.login(ArgumentMatchers.any())).thenThrow(new NotFoundException("Email or Password is invalid!!"));

        // WHEN, THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("Error").value("Email or Password is invalid!!"));
    }

    @Test
    void login_emptyUsername_failure() throws Exception {
        // GIVEN
        loginRequest.setUsername("");
        ObjectMapper objectMapper = new ObjectMapper();
        String content = objectMapper.writeValueAsString(loginRequest);

        Mockito.when(authenticationService.login(ArgumentMatchers.any())).thenThrow(new NotFoundException("Email or Password is invalid!!"));
        // WHEN, THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("Error").value("Email or Password is invalid!!"));

    }

    @Test
    void login_emptyPassword_failure() throws Exception {
        // GIVEN
        loginRequest.setPassword("");
        ObjectMapper objectMapper = new ObjectMapper();
        String content = objectMapper.writeValueAsString(loginRequest);

        Mockito.when(authenticationService.login(ArgumentMatchers.any())).thenThrow(new NotFoundException("Email or Password is invalid!!"));
        // WHEN, THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("Error").value("Email or Password is invalid!!"));
    }

}
