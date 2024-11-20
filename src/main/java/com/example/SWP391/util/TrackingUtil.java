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
        float smallBoxPrice = 0, mediumBoxPrice = 0, largeBoxPrice = 0, extraLargeBoxPrice = 0;

            if (boxAmount.getSmallBox() > 0) {
                smallBoxPrice += (listBoxPrice.get(0).getPrice() + listBoxPrice.get(0).getSurcharge()) * boxAmount.getSmallBox();
            }
            if (boxAmount.getMediumBox() > 0) {
                mediumBoxPrice += (listBoxPrice.get(1).getPrice() + listBoxPrice.get(1).getSurcharge()) * boxAmount.getMediumBox();
            }
            if (boxAmount.getLargeBox() > 0) {
                largeBoxPrice += (listBoxPrice.get(2).getPrice() + listBoxPrice.get(2).getSurcharge()) * boxAmount.getLargeBox();
            }
            if (boxAmount.getExtraLargeBox() > 0) {
                extraLargeBoxPrice += (listBoxPrice.get(3).getPrice() + listBoxPrice.get(3).getSurcharge()) * boxAmount.getExtraLargeBox();
            }

        return smallBoxPrice + mediumBoxPrice + largeBoxPrice + extraLargeBoxPrice;
    }
}
