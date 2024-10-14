package com.example.SWP391.util;

import com.example.SWP391.entity.BoxPrice;
import com.example.SWP391.entity.PriceListDistance;
import com.example.SWP391.entity.PriceListWeight;
import com.example.SWP391.entity.ShipMethod;
import com.example.SWP391.model.DTO.TrackingDTO.BoxAmountDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrackingUtil {

    public static double getPriceByBoxAmount(BoxAmountDTO boxAmount, List<BoxPrice> listBoxPrice) {
        float smallBoxPrice = listBoxPrice.get(0).getPrice() + boxAmount.getSmallBox() * listBoxPrice.get(0).getSurcharge();
        float mediumBoxPrice = listBoxPrice.get(1).getPrice() + boxAmount.getMediumBox() * listBoxPrice.get(1).getSurcharge();
        float largeBoxPrice = listBoxPrice.get(2).getPrice() + boxAmount.getLargeBox() * listBoxPrice.get(2).getSurcharge();
        float extraLargeBoxPrice = listBoxPrice.get(3).getPrice() + boxAmount.getExtraLargeBox() * listBoxPrice.get(3).getSurcharge();

        return smallBoxPrice + mediumBoxPrice + largeBoxPrice + extraLargeBoxPrice;
    }
}
