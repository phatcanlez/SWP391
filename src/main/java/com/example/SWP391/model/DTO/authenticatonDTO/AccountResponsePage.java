package com.example.SWP391.model.DTO.authenticatonDTO;

import com.example.SWP391.entity.Account;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
import lombok.Data;

import java.util.List;

@Data
public class AccountResponsePage {
    List<Account> content;
    int pageNumbers;
    long totalElements;
    int totalPages;
    int nummberOfElement;
}
