package com.example.SWP391.repository;

import com.example.SWP391.entity.BoxPrice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoxPriceRepository extends JpaRepository<BoxPrice, Long> {
    BoxPrice findBoxPriceByBoxId(long Id);
}
