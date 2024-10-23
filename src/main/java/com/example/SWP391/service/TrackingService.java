package com.example.SWP391.service;

import com.example.SWP391.entity.*;
import com.example.SWP391.model.DTO.TrackingDTO.EstimateTrackingRequestByBox;
import com.example.SWP391.repository.*;
import com.example.SWP391.util.TrackingUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<PriceListDistance> getTrackingList(long shipMethodID) {
        ShipMethod shipMethod = shipMethodRepository.findShipMethodByShipMethodId(shipMethodID);
        return priceListDistanceRepository.findPriceListDistanceByShipMethod(shipMethod);
    }

    public List<PriceListWeight> getPriceWeightListByShipMethod(long shipMethodID) {
        ShipMethod shipMethod = shipMethodRepository.findShipMethodByShipMethodId(shipMethodID);
        return priceListWeightRepository.findPriceListWeightByShipMethod(shipMethod);
    }

    public double estimateTrackingByBox(EstimateTrackingRequestByBox estimateTrackingRequestByBox) {

        List<PriceListDistance> listPrice = getTrackingList(estimateTrackingRequestByBox.getShipMethodID()).
                stream().sorted(Comparator.comparingInt(PriceListDistance::getDistance)).toList();
        List<PriceListWeight> listPriceWeight = getPriceWeightListByShipMethod(estimateTrackingRequestByBox.getShipMethodID()).
                stream().sorted((o1, o2) -> (int) (o1.getWeight() - o2.getWeight())).toList();
        List<BoxPrice> listBoxPrice = boxPriceRepository.findAll();

        double price = TrackingUtil.getPriceByBoxAmount(estimateTrackingRequestByBox.getBoxAmountDTO(), listBoxPrice);

        double kilometer = estimateTrackingRequestByBox.getKilometers();
        double distancePrice = 0;
        double weight = estimateTrackingRequestByBox.getWeight();
        double weightPrice = 0;

        if (weight < listPriceWeight.getLast().getWeight()) {
            for (var i = listPriceWeight.size() - 1; i >= 1; i--) {
                if (weight < listPriceWeight.get(i).getWeight() && weight >= listPriceWeight.get(i - 1).getWeight()) {
                    weightPrice = listPriceWeight.get(i - 1).getPrice();
                    break;
                }
            }
        }else {
            weightPrice = listPriceWeight.getLast().getPrice();
        }

        if (kilometer < listPrice.getLast().getDistance()) {
            for (var i = listPrice.size() - 1; i >= 1; i--) {
                if (kilometer < listPrice.get(i).getDistance() && kilometer >= listPrice.get(i - 1).getDistance()) {
                    distancePrice = listPrice.get(i - 1).getPrice();
                    break;
                }
            }
        }else {
            distancePrice = listPrice.getLast().getPrice();
        }

        return price + distancePrice + weightPrice;
    }

    public List<Status> getTrackingByOrderID(String orderID) {
        Orders order = orderRepository.findByorderID(orderID);
        return order.getStatus();
    }
}
