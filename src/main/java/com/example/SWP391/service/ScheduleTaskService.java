package com.example.SWP391.service;

import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Orders;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
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

//    @Scheduled(fixedRate = 600 * 1000)
    public void performTask() {
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
                    emailService.sendEmailOrderIsWaitingTooLong(order);
                }
                System.out.println("Không có nhân viên nào rảnh và gửi mail thông báo");
                return;
            }else {
                System.out.println(orders.getOrderDetail().getShipMethod().getShipMethodId());
                distanceService.processOrder(listRestEmp, orders);
            }
        }

    }
}
