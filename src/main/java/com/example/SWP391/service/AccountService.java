package com.example.SWP391.service;

import com.example.SWP391.entity.Account;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
import com.example.SWP391.model.Enum.Role;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private OrderService orderService;

    public List<Account> getAllRestEmployees(){
        try {
            List<Account> listEmp = accountRepository.findByRole(Role.STAFF);
            if (listEmp.isEmpty()) {
                return null;
            }
            //mảng ds nhân viên đang rảnh
            List<Account> listRestEmp = new ArrayList<>();

            for (Account account : listEmp) {
                List<OrderResponse> listApproved = orderService.viewOrderByStatusAndEmpId(StatusInfo.APPROVED, account.getId());
                Thread.sleep(1000);
                List<OrderResponse> listPending = orderService.viewOrderByStatusAndEmpId(StatusInfo.PENDING, account.getId());
                if (listApproved.isEmpty() && listPending.isEmpty()) {
                    listRestEmp.add(account);
                }
            }
            return listRestEmp;
        }catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error while getting all rest employees");
        }
    }
}
