package com.example.SWP391.util;

import com.example.SWP391.entity.BoxPrice;
import com.example.SWP391.entity.PriceListDistance;
import com.example.SWP391.entity.ShipMethod;
import com.example.SWP391.model.DTO.TrackingDTO.BoxAmountDTO;
import com.example.SWP391.repository.BoxPriceRepository;
import com.example.SWP391.repository.PriceListDistanceRepository;
import com.example.SWP391.repository.ShipMethodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class TrackingUtilTest {

    @Mock
    private ShipMethodRepository shipMethodRepository;

    @Mock
    private PriceListDistanceRepository priceListDistanceRepository;

    @Mock
    private BoxPriceRepository boxPriceRepository;

    @InjectMocks
    private TrackingUtil trackingUtil;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

}