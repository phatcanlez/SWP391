package com.example.SWP391.repository;

import com.example.SWP391.entity.PriceListDistance;
import com.example.SWP391.entity.ShipMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceListDistanceRepository extends JpaRepository<PriceListDistance, Long> {
    PriceListDistance findPriceListDistanceByPriceListId(long id);
    List<PriceListDistance> findPriceListDistanceByShipMethod(ShipMethod shipMethod);
}
