package com.example.SWP391.model.DTO.OrderDTO;

import com.example.SWP391.entity.Account;
import lombok.Data;

import java.util.Set;

@Data
public class OrderResponsible {
    Set<Account> listEmployee;
    int totalEmployee;
}
