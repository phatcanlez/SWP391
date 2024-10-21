package com.example.SWP391.service;

import com.example.SWP391.entity.BoxPrice;
import com.example.SWP391.entity.PriceListDistance;
import com.example.SWP391.entity.ShipMethod;
import com.example.SWP391.model.DTO.TrackingDTO.BoxAmountDTO;
import com.example.SWP391.model.DTO.TrackingDTO.EstimateTrackingRequestByBox;
import com.example.SWP391.repository.BoxPriceRepository;
import com.example.SWP391.repository.PriceListDistanceRepository;
import com.example.SWP391.repository.PriceListWeightRepository;
import com.example.SWP391.repository.ShipMethodRepository;
import com.example.SWP391.util.TrackingUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrackingService {

    @Autowired
    ShipMethodRepository shipMethodRepository;

    @Autowired
    PriceListWeightRepository priceListWeightRepository;

    @Autowired
    BoxPriceRepository boxPriceRepository;

    @Autowired
    PriceListDistanceRepository priceListDistanceRepository;


    public List<PriceListDistance> getTrackingList(long shipMethodID) {
        ShipMethod shipMethod = shipMethodRepository.findShipMethodByShipMethodId(shipMethodID);
        return priceListDistanceRepository.findPriceListDistanceByShipMethod(shipMethod);
    }

    public double estimateTrackingByBox(EstimateTrackingRequestByBox estimateTrackingRequestByBox) {

        List<PriceListDistance> listPrice = getTrackingList(estimateTrackingRequestByBox.getShipMethodID());
        List<BoxPrice> listBoxPrice = boxPriceRepository.findAll();

        double price = TrackingUtil.getPriceByBoxAmount(estimateTrackingRequestByBox.getBoxAmountDTO(), listBoxPrice);

        double tmpDistance = estimateTrackingRequestByBox.getKilometers();
        double distancePrice = 0;
        for (var i = 0; i < listPrice.size() - 1; i++) {
            if (tmpDistance <= listPrice.get(i).getDistance()) {
                distancePrice += tmpDistance * listPrice.get(i).getPrice();
                break;
            }
            tmpDistance -= listPrice.get(i).getDistance();
            distancePrice += listPrice.get(i).getDistance() * listPrice.get(i).getPrice();
        }
        return price + distancePrice;
    }
}
