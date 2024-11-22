package com.example.SWP391.OrderService;

import com.example.SWP391.entity.*;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.OrderDTO.OrderRequest;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
import com.example.SWP391.model.DTO.OrderDetailDTO.OrderDetailRequest;
import com.example.SWP391.model.Enum.Paystatus;
import com.example.SWP391.model.Enum.Role;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.*;
import com.example.SWP391.service.OrderDetailService;
import com.example.SWP391.service.OrderService;
import com.example.SWP391.util.DateConversionUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderDetailService orderDetailService;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private OrderService orderService;

    private OrderRequest orderRequest;
    private Orders order;
    private Account account;

    @BeforeEach
    void setUp() {
        // Set up Account
        account = new Account();
        account.setId("1");
        account.setRole(Role.CUSTOMER);
        account.setName("Test User");
        account.setUsername("testUser");
        account.setEmail("test@example.com");
        account.setAvatar("avatar.png");
        account.setStatus(true);
        account.setPhoneNumber("1234567890");
        account.setAddress("123 Test Street");
        account.setPassword("password");

        // Set up OrderRequest
        orderRequest = new OrderRequest();
        orderRequest.setUsername("testUser");
        orderRequest.setShipMethod(1);
        orderRequest.setReciverAdress("123 Receiver Street");
        orderRequest.setSenderAddress("123 Sender Street");
        orderRequest.setSenderPhoneNumber("0987654321");
        orderRequest.setExpDeliveryDate(new Date());
        orderRequest.setOrderPrice(100.0);
        orderRequest.setNote("Handle with care");
        orderRequest.setReciverPhoneNumber("1234567890");
        orderRequest.setReciverName("Receiver Name");
        orderRequest.setTotalPrice(150.0);
        orderRequest.setSmallBox(2);
        orderRequest.setMediumBox(1);
        orderRequest.setLargeBox(0);
        orderRequest.setExtraLargeBox(0);
        orderRequest.setKilometer(10);
        orderRequest.setTotalWeight(5.0);
        orderRequest.setQuantity(3);
        orderRequest.setType("Standard");
        Set<Long> extraService = new HashSet<>();
        extraService.add(1L);
        orderRequest.setExtraService(extraService);

        order = new Orders();
        order.setAccount(account);
        order.setStatus(new ArrayList<>());
    }

    @Test
    void testCreateOrder_Success() {
        doReturn(order).when(modelMapper).map(any(OrderRequest.class), eq(Orders.class));
        when(accountRepository.findByUsername(anyString())).thenReturn(account);
        when(orderRepository.save(any(Orders.class))).thenReturn(order);

        OrderDetailRequest orderDetailRequest = new OrderDetailRequest();
        doReturn(orderDetailRequest).when(modelMapper).map(any(OrderRequest.class), eq(OrderDetailRequest.class));

        OrderResponse orderResponse = new OrderResponse();
        doReturn(orderResponse).when(modelMapper).map(any(Orders.class), eq(OrderResponse.class));

        OrderResponse result = orderService.createOrder(orderRequest);

        assertNotNull(result);
        verify(orderRepository, times(1)).save(any(Orders.class));
        verify(paymentRepository, times(1)).save(any(Payment.class));
        verify(orderDetailService, times(1)).createOrderDetail(any());
    }

    @Test
    void testCreateOrder_AccountNotFound() {
        when(accountRepository.findByUsername(anyString())).thenReturn(null);
        assertThrows(NotFoundException.class, () -> orderService.createOrder(orderRequest));
    }

    @Test
    void testCreateOrder_DuplicateException() {
        doReturn(order).when(modelMapper).map(any(OrderRequest.class), eq(Orders.class));
        when(accountRepository.findByUsername(anyString())).thenReturn(account);
        when(orderRepository.save(any(Orders.class))).thenThrow(new DuplicateException("Unexpected error!"));
        assertThrows(DuplicateException.class, () -> orderService.createOrder(orderRequest));
    }
}