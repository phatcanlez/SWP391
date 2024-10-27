package com.example.SWP391.service;

import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Status;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
import com.example.SWP391.model.DTO.statusDTO.StatusRequest;
import com.example.SWP391.model.DTO.statusDTO.StatusResponse;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.repository.StatusRepository;
import com.example.SWP391.util.DateConversionUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class StatusService {
    @Autowired
    StatusRepository statusRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    OrderService orderService;

    public StatusResponse createStatus(StatusRequest statusRequest){
        try{
            Orders orders = orderRepository.findByorderID(statusRequest.getOrder());
            if (orders == null){
                throw new NotFoundException("Not found this order");
            }

            if (statusRequest.getStatusInfo().equals(StatusInfo.APPROVED.toString())){
                List<OrderResponse> ordersList = orderService.viewOrderByStatusAndEmpId(StatusInfo.valueOf(statusRequest.getStatusInfo()), statusRequest.getEmpId());
                if (ordersList.size() > 0){
                    throw new DuplicateException("You can't approved this order because you already have a approved order!!");
                }
            } else if (statusRequest.getStatusInfo().equals(StatusInfo.PENDING.toString())){
                List<OrderResponse> ordersList = orderService.viewOrderByStatusAndEmpId(StatusInfo.valueOf(statusRequest.getStatusInfo()), statusRequest.getEmpId());
                if (ordersList.size() > 0){
                    throw new DuplicateException("You can't pending this order because you already have a pending order!!");
                }
            }

            if (statusRequest.getStatusInfo().equals(StatusInfo.SUCCESS.toString())){
                orders.setActDeliveryDate(DateConversionUtil.convertToDate(LocalDateTime.now()));
                orderRepository.save(orders);
            }

            Status status = new Status();
            status.setStatusInfo(StatusInfo.valueOf(statusRequest.getStatusInfo()));
            status.setEmpId(statusRequest.getEmpId());
            status.setDescription(statusRequest.getDescription());
            status.setDate(DateConversionUtil.convertToDate(LocalDateTime.now()));
            status.setOrders(orders);
            statusRepository.save(status);

            StatusResponse statusResponse = modelMapper.map(status, StatusResponse.class);
            statusResponse.setOrderID(orders.getOrderID());
            return statusResponse;
        }catch (NotFoundException e){
            e.printStackTrace();
            throw new DuplicateException(e.getMessage());
        }catch (DuplicateException e){
            e.printStackTrace();
            throw new DuplicateException(e.getMessage());
        }catch (Exception e){
            e.printStackTrace();
            throw new DuplicateException("This status is error!!");
        }
    }

    public List<StatusResponse> getAllStatus(){
        List<Status> list = statusRepository.findAll();
        return list.stream().map(status -> {
            StatusResponse statusResponse = modelMapper.map(status, StatusResponse.class);
            statusResponse.setOrderID(status.getOrders().getOrderID());
            return statusResponse;
        }).toList();
    }

    public StatusResponse viewStatusById(long id){
        Status status = statusRepository.findById(id);
        if(status == null){
            throw new DuplicateException("Not found this status");
        }
        else{
            return modelMapper.map(status, StatusResponse.class);
        }
    }

    public StatusResponse updateStatus(StatusRequest statusRequest, long Id){
        Status oldStatus = statusRepository.findById(Id);
        if(oldStatus == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldStatus.setStatusInfo(StatusInfo.valueOf(statusRequest.getStatusInfo()));
            statusRepository.save(oldStatus);
            StatusResponse statusResponse = modelMapper.map(oldStatus, StatusResponse.class);
            statusResponse.setOrderID(oldStatus.getOrders().getOrderID());
            return statusResponse;
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }
}
