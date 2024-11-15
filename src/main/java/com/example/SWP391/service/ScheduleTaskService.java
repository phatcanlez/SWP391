package com.example.SWP391.service;

import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Payment;
import com.example.SWP391.model.DTO.statusDTO.StatusRequest;
import com.example.SWP391.model.Enum.Paystatus;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.PaymentRepository;
import com.example.SWP391.util.TrackingUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
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

    @Autowired
    PaymentService paymentService;

    @Autowired
    PaymentRepository paymentRepository;

//    @Scheduled(fixedRate = 12 * 60 * 60 * 1000)//1 tiếng check 1 lần
    public void performTask() {
        try {
            System.out.println("Task performed at " + new Date());
            //lấy ds đơn hàng chờ quá lâu
            List<Orders> listOrders = orderService.getOrderWaitingToLong();
            if (listOrders.isEmpty()) {
                System.out.println("Không có đơn hàng nào quá lâu");
                return;
            }
            System.out.println("Có " + listOrders.size() + " đơn hàng quá lâu");

            //sắp xếp đơn theo độ ưu tiên của gói vận chuyển
            TrackingUtil.sortOrderByShipMethod(listOrders);
            System.out.println("Sắp xếp xong");

            for (Orders orders : listOrders) {
                //lấy danh sách nhân viên đang rảnh
                List<Account> listRestEmp = accountService.getAllRestEmployees();
                System.out.println("Có " + listRestEmp.size() + " nhân viên rảnh");

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

//    @Scheduled(fixedRate = 60 * 60 * 1000)//1 tiếng check 1 lần
    @Transactional
    public void scheduleCheckPayment() {
        try {
            List<Payment> FailList = paymentService.getPaymentByStatus(Paystatus.CANCEL.toString());
            FailList.forEach(payment -> {
                Orders order = payment.getOrders();
                StatusRequest statusFail = new StatusRequest();
                statusFail.setOrder(order.getOrderID());
                statusFail.setStatusInfo(StatusInfo.FAIL.toString());
                statusFail.setEmpId("SYSTEM");
                statusFail.setDescription("Order is canceled because payment is not completed");
                statusService.createStatus(statusFail);
            });

            List<Payment> unpayList = paymentService.getPaymentByStatus(Paystatus.UNPAYED.toString());
            if (unpayList.isEmpty()) {
                return;
            }
            for (Payment payment : unpayList) {
                Orders order = payment.getOrders();
                Date creDate = order.getStatus().getFirst().getDate();
                Date now = new Date(System.currentTimeMillis());
                if (now.getTime() - creDate.getTime() > 24 * 60 * 60 * 1000) {
                    StatusRequest statusFail = new StatusRequest();
                    statusFail.setOrder(order.getOrderID());
                    statusFail.setStatusInfo(StatusInfo.FAIL.toString());
                    statusFail.setEmpId("SYSTEM");
                    statusFail.setDescription("Order is canceled because payment is not completed");
                    statusService.createStatus(statusFail);
                    paymentService.updatePaymentToFail(payment.getPaymentId());
                }
            }
        } catch (Exception e) {
            emailService.sendEmailErrorRuntime(e.getMessage());
        }
    }

//    @Transactional
//    @Scheduled(fixedRate = 60 * 60 * 1000)//1 tiếng check 1 lần
    public void scheduleCheckOrder() {
        try {
            System.out.println("Task performed at " + new Date());
            List<Payment> FailList = paymentService.getPaymentByStatus(Paystatus.UNPAYED.toString());
            FailList.forEach(payment -> {
                payment.setStatus(StatusInfo.SUCCESS.toString());
                payment.setTimeOfPay(new Date(System.currentTimeMillis()));

                paymentRepository.save(payment);
            });
            System.out.println("Đã cập nhật trạng thái thanh toán");
            List<Orders> listOrders = orderService.viewOrderByStatus(StatusInfo.WAITING);
            if (listOrders.isEmpty()) {
                return;
            }
            for (Orders order : listOrders) {
                StatusRequest statusRequest = new StatusRequest();
                statusRequest.setOrder(order.getOrderID());
                statusRequest.setStatusInfo(StatusInfo.SUCCESS.toString());
                statusRequest.setEmpId("69f48e3b-8b04-4580-a74a-7ff79a9a103a");
                statusRequest.setDescription("Order Delivered Successfully");
                statusService.createStatus(statusRequest);
                System.out.println("Đã giao hàng thành công");
            }
            System.out.println("size: " + listOrders.size());
        } catch (Exception e) {
            emailService.sendEmailErrorRuntime(e.getMessage());
        }
    }
}
