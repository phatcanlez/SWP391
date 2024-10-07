package com.example.SWP391.service;

import com.example.SWP391.entity.Account;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.authenticatonDTO.AccountResponse;
import com.example.SWP391.model.DTO.authenticatonDTO.LoginRequest;
import com.example.SWP391.model.DTO.authenticatonDTO.RegisterRequest;
import com.example.SWP391.model.DTO.authenticatonDTO.TokenService;
import com.example.SWP391.model.Enum.Role;
import com.example.SWP391.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthenticationServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password");
        registerRequest.setEmail("test@example.com");

        Account account = new Account();
        account.setUsername("testuser");
        account.setPassword("encodedPassword");
        account.setEmail("test@example.com");
        account.setRole(Role.CUSTOMER);
        account.setStatus(true);

        AccountResponse expectedResponse = new AccountResponse();
        expectedResponse.setUsername("testuser");
        expectedResponse.setEmail("test@example.com");

        when(modelMapper.map(registerRequest, Account.class)).thenReturn(account);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(accountRepository.save(any(Account.class))).thenReturn(account);
        when(modelMapper.map(account, AccountResponse.class)).thenReturn(expectedResponse);

        AccountResponse result = authenticationService.register(registerRequest);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());

        verify(accountRepository).save(any(Account.class));
    }


    @Test
    void testLoginSuccess() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        Account account = new Account();
        account.setUsername("testuser");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(account);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(modelMapper.map(account, AccountResponse.class)).thenReturn(new AccountResponse());
        when(tokenService.generateToken(account)).thenReturn("testToken");

        AccountResponse result = authenticationService.login(loginRequest);

        assertNotNull(result);
        assertEquals("testToken", result.getToken());
    }

    @Test
    void testLoginFailure() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("wronguser");
        loginRequest.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Authentication failed"));

        assertThrows(NotFoundException.class, () -> authenticationService.login(loginRequest));
    }
}

