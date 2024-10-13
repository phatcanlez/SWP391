package com.example.SWP391.AuthentiactionService;

import com.example.SWP391.entity.Account;
import com.example.SWP391.model.DTO.authenticatonDTO.AccountResponse;
import com.example.SWP391.model.DTO.authenticatonDTO.LoginRequest;
import com.example.SWP391.service.AuthenticationService;
import com.example.SWP391.service.TokenService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
public class AuthentiactionServiceTest {


    @Autowired
    AuthenticationService authenticationService;

    @MockBean
    ModelMapper modelMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private TokenService tokenService;

    private LoginRequest loginRequest;
    private ResponseEntity responseEntity;
    private AccountResponse accountResponse;
    private Account account;

    @BeforeEach
    public void initData(){
        loginRequest = new LoginRequest();
        loginRequest.setUsername("quoc");
        loginRequest.setPassword("123456");

        accountResponse = new AccountResponse();
        accountResponse.setUsername("quoc");
        accountResponse.setToken("dummyToken");

        account = new Account();
        account.setUsername("quoc");
        account.setPassword("encodedPassword");
    }

    @Test
    void login_success() {
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(account);
        when(modelMapper.map(account, AccountResponse.class)).thenReturn(accountResponse);
        when(tokenService.generateToken(account)).thenReturn("dummyToken");

        AccountResponse response = authenticationService.login(loginRequest);

        assertNotNull(response);
        assertEquals("quoc", response.getUsername());
        assertEquals("dummyToken", response.getToken());
    }

}
