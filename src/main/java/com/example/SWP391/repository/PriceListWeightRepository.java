package com.example.SWP391.repository;

import com.example.SWP391.entity.PriceListWeight;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceListWeightRepository extends JpaRepository<PriceListWeight, Long> {
    PriceListWeight findPriceListWeightByPriceListId(long id);
}
