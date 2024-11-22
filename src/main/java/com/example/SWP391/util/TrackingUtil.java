package com.example.SWP391.util;

import com.example.SWP391.entity.*;
import com.example.SWP391.model.DTO.TrackingDTO.BoxAmountDTO;
import com.example.SWP391.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
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

    public static void sortOrderByShipMethod(List<Orders> orders) {
        try {
            orders.sort((o1, o2) -> {
                long index1 = o1.getOrderDetail().getShipMethod().getShipMethodId();
                long index2 = o2.getOrderDetail().getShipMethod().getShipMethodId();
                return Long.compare(index1, index2);
            });
        }catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error while sorting order by ship method");
        }
    }

    public static boolean checkCountryIsVietnam(String address) {
        String country = address.substring(address.lastIndexOf(",") + 1).trim();
        return country.equalsIgnoreCase("Vietnam");
    }

    public static String getCountry(String address) {
        return address.substring(address.lastIndexOf(",") + 1).trim().toLowerCase();
    }
}
