package com.example.SWP391.repository;

import com.example.SWP391.entity.Report;
import com.example.SWP391.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Report findById(long id);
}
