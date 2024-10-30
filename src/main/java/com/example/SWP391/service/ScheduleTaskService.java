package com.example.SWP391.service;

import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Orders;
import com.example.SWP391.model.DTO.EmailDetail;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
import com.example.SWP391.model.DTO.statusDTO.StatusRequest;
import com.example.SWP391.model.Enum.Role;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.AccountRepository;
import com.example.SWP391.util.TrackingUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScheduleTaskService {

    @Autowired
    DistanceService distanceService;

    @Autowired
    AccountService accountService;

    @Autowired
    OrderService orderService;

    @Autowired
    EmailService emailService;

    @Autowired
    StatusService statusService;

    @Scheduled(fixedRate = 12 * 60 * 60 * 1000)
    public void performTask() {
        try {
            //lấy ds đơn hàng chờ quá lâu
            List<Orders> listOrders = orderService.getOrderWaitingToLong();
            if (listOrders.isEmpty()) {
                return;
            }

            //sắp xếp đơn theo độ ưu tiên của gói vận chuyển
            TrackingUtil.sortOrderByShipMethod(listOrders);

            for (Orders orders : listOrders) {
                //lấy danh sách nhân viên đang rảnh
                List<Account> listRestEmp = accountService.getAllRestEmployees();
                if (listRestEmp.isEmpty()) {
                    for (Orders order : listOrders) {
                        StatusRequest statusRequest = new StatusRequest();
                        statusRequest.setOrder(order.getOrderID());
                        statusRequest.setStatusInfo(StatusInfo.WAITING.toString());
                        statusRequest.setEmpId("");
                        statusRequest.setDescription("Order is waiting for more than 2 days because there is no employee available");
                        statusService.createStatus(statusRequest);
                        emailService.sendEmailOrderIsWaitingTooLong(order);
                    }
                    System.out.println("Không có nhân viên nào rảnh và gửi mail thông báo");
                    return;
                } else {
                    System.out.println("ShipmethodId: " + orders.getOrderDetail().getShipMethod().getShipMethodId());
                    distanceService.processOrder(listRestEmp, orders);
                }
            }
        } catch (Exception e) {
            emailService.sendEmailErrorRuntime(e.getMessage());
        }
    }
}
