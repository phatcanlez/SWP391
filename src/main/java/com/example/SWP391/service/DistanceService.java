package com.example.SWP391.service;

import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Orders;
import com.example.SWP391.model.DTO.ScheduleDTO.DistanceAndEmp;
import com.example.SWP391.model.DTO.statusDTO.StatusRequest;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DistanceService {
    @Autowired
    private APIService apiService;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    StatusService statusService;

    @Autowired
    EmailService emailService;

    private static final int BATCH_SIZE = 9; // MapQuest cho phép tối đa 25 locations trong 1 lần gọi

    public void processOrder(List<Account> accounts, Orders order) {
        //mảng để chứa những nhân viên gần nhất với đơn hàng
        List<DistanceAndEmp> distanceAndEmps = new ArrayList<>();

        //chia danh sách nhân viên thành các batch nhỏ để gọi API
        List<List<Account>> batches = splitIntoBatches(accounts, BATCH_SIZE);

        //gọi APi với từng batch nhỏ
        for (List<Account> batch : batches) {
            apiService.processBatch(batch, distanceAndEmps, order.getSenderAddress());
        }

        // xử lí mảng danh sách những staff gần nhất với đơn hàng mà có thể giao vì chưa nhận đơn nào
        if (distanceAndEmps.isEmpty()) {
            //gửi mail báo đợi nhân viên
            emailService.sendEmailOrderIsWaitingTooLong(order);
            System.out.println("Không có nhân viên nào có thể giao đơn hàng này");

        }else {
            //sort lại mảng theo khoảng cách
            distanceAndEmps.sort(Comparator.comparing(DistanceAndEmp::getDistance));
            Account mostEmp = distanceAndEmps.getFirst().getEmp();
            System.out.println("địa chỉ gửi của đơn hàng: " + order.getSenderAddress());
            System.out.println("Nhân viên gần nhất và phù hợp nhất: " + mostEmp.getName());

            StatusRequest statusRequest = new StatusRequest();
            statusRequest.setEmpId(mostEmp.getId());
            statusRequest.setOrder(order.getOrderID());
            statusRequest.setStatusInfo(StatusInfo.APPROVED.toString());
            statusRequest.setDescription("The order is approved");
            statusService.createStatus(statusRequest);
        }
    }

    private List<List<Account>> splitIntoBatches(List<Account> accounts, int batchSize) {
        List<List<Account>> batches = new ArrayList<>();
        for (int i = 0; i < accounts.size(); i += batchSize) {
            batches.add(accounts.subList(i, Math.min(accounts.size(), i + batchSize)));
        }
        return batches;
    }


}
