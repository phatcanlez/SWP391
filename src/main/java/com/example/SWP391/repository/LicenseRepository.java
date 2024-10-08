package com.example.SWP391.repository;

import com.example.SWP391.entity.License;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LicenseRepository extends JpaRepository<License, Long> {
    License findLicenseById(long Id);
}
