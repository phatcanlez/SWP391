package com.example.SWP391.repository;

import com.example.SWP391.entity.License;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LicenseRepository extends JpaRepository<License, Long> {
    License findLicenseById(long Id);
    List<License> findLicenseByOrdersOrderID(String id);
}
