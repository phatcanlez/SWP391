package com.example.SWP391.repository;

import com.example.SWP391.entity.PriceListWeight;
import com.example.SWP391.entity.ShipMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceListWeightRepository extends JpaRepository<PriceListWeight, Long> {
    PriceListWeight findPriceListWeightByPriceListId(long id);
    PriceListWeight findPriceListWeightByShipMethod(ShipMethod shipMethod);
}
