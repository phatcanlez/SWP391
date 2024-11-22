package com.example.SWP391.repository;

import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Report findReportById(long id);
    Page<Report> findAll(Pageable pageable);
}
