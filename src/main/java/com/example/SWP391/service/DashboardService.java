package com.example.SWP391.service;

import com.example.SWP391.entity.Orders;
import com.example.SWP391.model.Enum.Role;
import com.example.SWP391.repository.AccountRepository;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.repository.PaymentRepository;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    OrderRepository orderRepository;

        public Map<String, Object> getDashboardStats(){

            Map<String, Object> stats = new HashMap<>();

            long totalAccount = accountRepository.count();

            //dem so luong customer
            long totalCustomer = accountRepository.countByRole(Role.CUSTOMER);

            //dem so luong admin
            long totalManager = accountRepository.countByRole(Role.MANAGER);

            //dem so luong owner
            long totalStaff = accountRepository.countByRole(Role.STAFF);

            long totalOrder = orderRepository.count();

            stats.put("totalOrder", totalOrder);
            stats.put("totalCustomer", totalCustomer);
            stats.put("totalManager", totalManager);
            stats.put("totalStaff", totalStaff);
            stats.put("totalAccount", totalAccount);

            return stats;
        }

        public Map<String,Object> caculateMonthlyRevenue(){
            Map<String, Object> stats = new HashMap<>();
            List<Object[]> list = paymentRepository.caculateMonthlyRevenue();
            List<Map<String,Object>> result = new ArrayList<>();
            for (Object[] i : list) {
                Map<String,Object> map = new HashMap<>();
                map.put("totalPrice", i[0]);
                map.put("week", i[1]);
                map.put("day", i[2]);
                result.add(map);
            }
            stats.put("monthlyRevenue", result);
            return stats;
        }
}
