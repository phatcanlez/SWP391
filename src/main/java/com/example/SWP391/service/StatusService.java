package com.example.SWP391.service;

import com.example.SWP391.entity.*;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponse;
import com.example.SWP391.model.DTO.OrderDTO.OrderResponsible;
import com.example.SWP391.model.DTO.chatDTO.RoomRequest;
import com.example.SWP391.model.DTO.statusDTO.StatusRequest;
import com.example.SWP391.model.DTO.statusDTO.StatusResponse;
import com.example.SWP391.model.Enum.OrderType;
import com.example.SWP391.model.Enum.Paystatus;
import com.example.SWP391.model.Enum.StatusInfo;
//import com.example.SWP391.repository.OrderOverseaRepository;
import com.example.SWP391.repository.OrderOverseaRepository;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.repository.StatusRepository;
import com.example.SWP391.util.AccountUtils;
import com.example.SWP391.util.DateConversionUtil;
import com.example.SWP391.util.TrackingUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class StatusService {
    @Autowired
    StatusRepository statusRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderOverseaRepository orderOverseaRepository;

    @Autowired
    OrderDetailService orderDetailService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    OrderService orderService;

    @Autowired
    AuthenticationService authenticationService;
    @Autowired
    AccountUtils accountUtils;

    @Autowired
    ChatService chatService;

    public StatusResponse createStatus(StatusRequest statusRequest) {
        try {
            Orders orders = orderRepository.findByorderID(statusRequest.getOrder());
            if (orders == null) {
                throw new NotFoundException("Not found this order");
            }

            //xử lí đơn trong nước vs ngoại, nếu ngoại thì phải 2 staff nhận
            if (statusRequest.getStatusInfo().equals(StatusInfo.APPROVED.toString())) {
                List<OrderResponse> ordersList = orderService.viewOrderByStatusAndEmpId(StatusInfo.valueOf(statusRequest.getStatusInfo()), statusRequest.getEmpId());
                if (ordersList.size() > 0) {
                    throw new DuplicateException("You can't approved this order because you already have a approved order!!");
                }

                if (orderDetailService.checkOrderType(statusRequest.getOrder(), OrderType.OVERSEA)) {
                    OrderResponsible orderResponsible = orderService.viewOrderResponsible(statusRequest.getOrder());
                    List<Account> listEmp = orderResponsible.getListEmployee().stream().toList();
                    int totelEmp = listEmp.size();
                    Account curAccount = authenticationService.getCurrentAccount();
                    if (totelEmp == 1) {
                        String AddressEmp = listEmp.getFirst().getAddress();
                        curAccount = authenticationService.getCurrentAccount();

                        List<OrderResponse> ordersListApproveOversea = orderService.viewOrderByStatusAndEmpId(StatusInfo.WATINGFOR2NDSTAFF, statusRequest.getEmpId());
                        if (ordersList.size() > 0) {
                            throw new DuplicateException("You can't approved this order because you already have a approved order!!");
                        }

                        if (TrackingUtil.checkCountryIsVietnam(AddressEmp)) {
                            if (TrackingUtil.checkCountryIsVietnam(curAccount.getAddress())) {
                                throw new DuplicateException("You can't approved this order already have a approved by a Vietnamese staff!!");
                            } else {
                                statusRequest.setStatusInfo(StatusInfo.APPROVED.toString());
                                OverseaOrder overseaOrder = orderOverseaRepository.findOrdersByOrderId(orders.getOrderID());
                                overseaOrder.setEmployeeId2(curAccount.getId());
                                orderOverseaRepository.save(overseaOrder);
                            }

                        } else {
                            if (!TrackingUtil.checkCountryIsVietnam(curAccount.getAddress())) {
                                throw new DuplicateException("You can't approved this order already have a approved by a Japanese staff!!");
                            } else {
                                statusRequest.setStatusInfo(StatusInfo.APPROVED.toString());
                                OverseaOrder overseaOrder = orderOverseaRepository.findOrdersByOrderId(orders.getOrderID());
                                overseaOrder.setEmployeeId2(curAccount.getId());
                                orderOverseaRepository.save(overseaOrder);
                            }
                        }
                    } else {
                        statusRequest.setStatusInfo(StatusInfo.WATINGFOR2NDSTAFF.toString());
                        OverseaOrder overseaOrder = new OverseaOrder();
                        overseaOrder.setOrderId(orders.getOrderID());
                        overseaOrder.setEmployeeId1(curAccount.getId());
                        orderOverseaRepository.save(overseaOrder);
                    }
                }
            } else if (statusRequest.getStatusInfo().equals(StatusInfo.PENDING.toString())) {
                List<OrderResponse> ordersListIsPending = orderService.viewOrderByStatusAndEmpId(StatusInfo.valueOf(statusRequest.getStatusInfo()), statusRequest.getEmpId());
                if (ordersListIsPending.size() > 0) {
                    throw new DuplicateException("You can't pending this order because you already have a pending order!!");
                }
            }

            if (statusRequest.getStatusInfo().equals(StatusInfo.FAIL.toString())) {
                Payment payment = orders.getPayment();
                if (payment.getStatus().equals(Paystatus.SUCCESS.toString())) {
                    {
                        statusRequest.setStatusInfo(StatusInfo.UNREFUND.toString());
                    }
                }
            }
            if (statusRequest.getStatusInfo().equals(StatusInfo.SUCCESS.toString())) {
                orders.setActDeliveryDate(DateConversionUtil.convertToDate(LocalDateTime.now()));
                orderRepository.save(orders);
            }

            //kiểm tra trạng thái của đơn nếu là APPROVED thì tạo boxchat
            if (statusRequest.getStatusInfo().equals(StatusInfo.APPROVED.toString())) {
                //create chatbox
                List<String> userRooms = new ArrayList<>();
                userRooms.add(orders.getAccount().getId());
                userRooms.add(accountUtils.getCurrentUser().getId());
                //create Room Chat
                RoomRequest roomRequest = new RoomRequest();
                roomRequest.setMembers(userRooms);
                chatService.createNewRoom(roomRequest);
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

        } catch (NotFoundException e) {
            e.printStackTrace();
            throw new NotFoundException(e.getMessage());
        } catch (DuplicateException e) {
            e.printStackTrace();
            throw new DuplicateException(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            throw new DuplicateException("This status is error!!");
        }
    }

    public List<StatusResponse> getAllStatus() {
        List<Status> list = statusRepository.findAll();
        return list.stream().map(status -> {
            StatusResponse statusResponse = modelMapper.map(status, StatusResponse.class);
            statusResponse.setOrderID(status.getOrders().getOrderID());
            return statusResponse;
        }).toList();
    }

    public StatusResponse viewStatusById(long id) {
        Status status = statusRepository.findById(id);
        if (status == null) {
            throw new DuplicateException("Not found this status");
        } else {
            return modelMapper.map(status, StatusResponse.class);
        }
    }

    public StatusResponse updateStatus(StatusRequest statusRequest, long Id) {
        Status oldStatus = statusRepository.findById(Id);
        if (oldStatus == null) {
            throw new NotFoundException("Not found!");
        }
        try {
            oldStatus.setStatusInfo(StatusInfo.valueOf(statusRequest.getStatusInfo()));
            statusRepository.save(oldStatus);
            StatusResponse statusResponse = modelMapper.map(oldStatus, StatusResponse.class);
            statusResponse.setOrderID(oldStatus.getOrders().getOrderID());
            return statusResponse;
        } catch (Exception e) {
            throw new DuplicateException("Update fail");
        }
    }
}
