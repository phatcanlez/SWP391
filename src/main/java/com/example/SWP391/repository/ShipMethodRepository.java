package com.example.SWP391.repository;

import com.example.SWP391.entity.ShipMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipMethodRepository extends JpaRepository<ShipMethod, Long> {
    ShipMethod findShipMethodByShipMethodId(long id);
}
