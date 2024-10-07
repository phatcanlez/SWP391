package com.example.SWP391.repository;

import com.example.SWP391.entity.BoxPrice;
import com.example.SWP391.entity.ExtraService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExtraServiceRepository extends JpaRepository<ExtraService, Long> {
    ExtraService findExtraServiceByExtraServiceId(long extraServiceId);
}
