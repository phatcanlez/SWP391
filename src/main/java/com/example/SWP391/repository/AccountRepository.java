package com.example.SWP391.repository;

import com.example.SWP391.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

//dùng interface extend lại JpaRepository<kiểu data, kiểu data của khóa chính>
public interface AccountRepository extends JpaRepository<Account, String> {
    Account findByUsername(String username);
    Account findAccountById(String Id);
    Account findAccountByEmail(String email);
}
