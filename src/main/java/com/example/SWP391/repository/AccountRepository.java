package com.example.SWP391.repository;

import com.example.SWP391.entity.Account;
import com.example.SWP391.model.Enum.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

//dùng interface extend lại JpaRepository<kiểu data, kiểu data của khóa chính>
public interface AccountRepository extends JpaRepository<Account, String> {
    Account findByUsername(String username);
    Account findAccountById(String Id);
    Account findAccountByEmail(String email);
    List<Account> findByRole(Role role);
    Page<Account> findAll(Pageable pageable);

    @Query("SELECT COUNT(a) FROM Account a WHERE a.role = :role")
    long countByRole(@Param("role") Role role);

}
