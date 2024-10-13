package com.example.SWP391.service;

import com.example.SWP391.entity.BoxPrice;
import com.example.SWP391.entity.ExtraService;
import com.example.SWP391.entity.OrderDetail;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.OrderDetailDTO.OrderDetailRequest;
import com.example.SWP391.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class OrderDetailService {
    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ShipMethodRepository shipMethodRepository;

    @Autowired
    ExtraServiceRepository extraServiceRepository;

    @Autowired
    BoxPriceRepository boxPriceRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<OrderDetail> getAllOrdersDetail() {
       List<OrderDetail> list = orderDetailRepository.findAll();
        return list;
    }

    public OrderDetail createOrderDetail(OrderDetailRequest orderDetail) {
        try {
            OrderDetail newOrder = modelMapper.map(orderDetail, OrderDetail.class);
            newOrder.setOrders(orderRepository.findByorderID(orderDetail.getOrderID()));
            newOrder.setShipMethod(shipMethodRepository.findShipMethodByShipMethodId(orderDetail.getShipMethodId()));
            List<BoxPrice> boxPrice = boxPriceRepository.findAll();
            Set<BoxPrice> boxPrices = new HashSet<>();
            if (newOrder.getSmallBox() > 0) {
                boxPrices.add(boxPrice.get(0));
            }
            if (newOrder.getMediumBox() > 0) {
                boxPrices.add(boxPrice.get(1));
            }
            if (newOrder.getLargeBox() > 0) {
                boxPrices.add(boxPrice.get(2));
            }
            if (newOrder.getExtraLargeBox() > 0) {
                boxPrices.add(boxPrice.get(3));
            }
            newOrder.setBoxPrice(boxPrices);
            Set<ExtraService> extraServices = new HashSet<>();
            for (long extraService : orderDetail.getExtraServiceId()) {
                extraServices.add(extraServiceRepository.findExtraServiceByExtraServiceId(extraService));
            }
            newOrder.setExtraService(extraServices);


            return orderDetailRepository.save(newOrder);
        } catch (Exception e) {
            e.printStackTrace();
            throw new DuplicateException("Unexpected error!");
        }
    }

        public OrderDetail viewOrderDetailById(String id) {
            OrderDetail orderDetail = orderDetailRepository.findOrderDetailByOrdDetailId(id);
            if (orderDetail == null) {
                throw new NotFoundException("Not found this order");
            } else {
                return orderDetail;
            }
        }


    public OrderDetail updateOrderDetail(OrderDetailRequest orderDetail, String id) {
        OrderDetail existingOrder = orderDetailRepository.findOrderDetailByOrdDetailId(id);
        if (existingOrder == null) {
            throw new NotFoundException("Not found!");
        }
        try {
            existingOrder.setKilometer(orderDetail.getKilometer());
            existingOrder.setSmallBox(orderDetail.getSmallBox());
            existingOrder.setMediumBox(orderDetail.getMediumBox());
            existingOrder.setLargeBox(orderDetail.getLargeBox());
            existingOrder.setExtraLargeBox(orderDetail.getExtraLargeBox());

            List<BoxPrice> boxPrice = boxPriceRepository.findAll();
            Set<BoxPrice> boxPrices = new HashSet<>();
            for (BoxPrice box : boxPrice) {
                if (orderDetail.getSmallBox() > 0) {
                    boxPrices.add(box);
                } else if (orderDetail.getMediumBox() > 0) {
                    boxPrices.add(box);
                } else if (orderDetail.getLargeBox() > 0) {
                    boxPrices.add(box);
                } else if (orderDetail.getExtraLargeBox() > 0) {
                    boxPrices.add(box);
                }
            }
            existingOrder.setBoxPrice(boxPrices);

            existingOrder.setShipMethod(shipMethodRepository.findShipMethodByShipMethodId(orderDetail.getShipMethodId()));

            Set<ExtraService> extraServices = new HashSet<>();
            for (long extraService : orderDetail.getExtraServiceId()) {
                extraServices.add(extraServiceRepository.findExtraServiceByExtraServiceId(extraService));
            }
            existingOrder.setExtraService(extraServices);

            return orderDetailRepository.save(existingOrder);
        } catch (Exception e) {
            throw new DuplicateException("Unexpected error!");
        }
    }
}

