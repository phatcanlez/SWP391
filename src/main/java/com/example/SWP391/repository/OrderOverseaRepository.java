package com.example.SWP391.repository;

import com.example.SWP391.entity.OverseaOrder;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderOverseaRepository extends JpaRepository<OverseaOrder, String> {
    List<OverseaOrder> findOrdersByEmployeeId1(String emp1);
    List<OverseaOrder> findOrdersByemployeeId2(String emp2);
    OverseaOrder findOrdersByOrderId(String orderId);
}
