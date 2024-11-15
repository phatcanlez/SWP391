package com.example.SWP391.service;

import com.example.SWP391.entity.*;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.OrderDTO.*;
import com.example.SWP391.model.DTO.OrderDetailDTO.OrderDetailRequest;
import com.example.SWP391.model.DTO.statusDTO.StatusRequest;
import com.example.SWP391.model.Enum.Paystatus;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.*;
import com.example.SWP391.util.DateConversionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    StatusRepository statusRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    OrderDetailService orderDetailService;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    StatusService statusService;

    public OrdersReponsePage getAllOrders(int page, int size) {
        Page<Orders> orders = orderRepository.findAll(PageRequest.of(page, size));
        List<OrderResponse> orderResponses = orders.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            orderResponse.setPayment(order.getPayment().getStatus());
            String type = String.valueOf(orderDetailService.viewOrderDetailById(order.getOrderID()).getType());
            orderResponse.setType(type);
            return orderResponse;
        }).toList();
        OrdersReponsePage ordersReponsePage = new OrdersReponsePage();
        ordersReponsePage.setContent(orderResponses);
        ordersReponsePage.setPageNumbers(orders.getNumber());
        ordersReponsePage.setTotalElements(orders.getTotalElements());
        ordersReponsePage.setTotalPages(orders.getTotalPages());
        ordersReponsePage.setNummberOfElement(orders.getNumberOfElements());
        return ordersReponsePage;
    }

    public OrderResponse createOrder(OrderRequest order) {
        try {
            Orders newOrder = modelMapper.map(order, Orders.class);
            Account account = accountRepository.findByUsername(order.getUsername());

            if (account == null) {
                throw new NotFoundException("Account not found");
            }

            newOrder.setAccount(account);
            Status status = new Status();
            status.setStatusInfo(StatusInfo.WAITING);
            status.setDate(DateConversionUtil.convertToDate(LocalDateTime.now()));
            status.setOrders(newOrder);
            status.setDescription("Waiting for confirmation");
            status.setEmpId("");
            newOrder.getStatus().add(status);
            Payment payment = new Payment();
            payment.setOrders(newOrder);
            payment.setStatus(Paystatus.UNPAYED.toString());
            paymentRepository.save(payment);
            newOrder.setPayment(payment);
            newOrder = orderRepository.save(newOrder);
            OrderDetailRequest orderDetail = modelMapper.map(order, OrderDetailRequest.class);
            orderDetail.setOrderID(newOrder.getOrderID());
            orderDetail.setShipMethodId(order.getShipMethod());
            orderDetail.setExtraServiceId(order.getExtraService());
            orderDetailService.createOrderDetail(orderDetail);
            OrderResponse orderResponse = modelMapper.map(newOrder, OrderResponse.class);
            orderResponse.setStatus(newOrder.getStatus().getLast());
            orderResponse.setPayment(newOrder.getPayment().getStatus());
            orderResponse.setType(order.getType());
            return orderResponse;
        } catch (NotFoundException e) {


            throw new NotFoundException(" Account not found");
        }catch (Exception e) {

            throw new DuplicateException("Unexpected error!");
        }
    }

    public Orders viewOrderById(String id) {
        Orders order = orderRepository.findByorderID(id);
        if (order == null) {
            throw new NotFoundException("Not found this order");
        } else {
            return order;
        }
    }

    public Orders updateOrder (OrderRequest order,String id){
        Orders existingOrder = orderRepository.findByorderID(id);
        if (existingOrder == null) {
            throw new NotFoundException("Not found!");
        }
        try {
            existingOrder.setReciverAdress(order.getReciverAdress());
            existingOrder.setExpDeliveryDate(order.getExpDeliveryDate());
            existingOrder.setReciverName(order.getReciverName());
            existingOrder.setNote(order.getNote());
            existingOrder.setReciverPhoneNumber(order.getReciverPhoneNumber());
            existingOrder.setOrderPrice(order.getOrderPrice());
            return orderRepository.save(existingOrder);
        } catch (Exception e) {
            throw new DuplicateException("Unexpected error!");
        }
    }

    @Transactional
    public List<Orders> viewOrderByStatus(StatusInfo status) {
        try {
            List<Status> statuses = statusRepository.findByStatusInfo(status);
            List<Orders> list = new ArrayList<>();
            for (Status s : statuses) {
                Orders orders = s.getOrders();
                if (orders.getStatus().getLast().getStatusInfo() == status) {
                    list.add(orders);
                }
            }

            return list;
        } catch (Exception e) {
            throw new NotFoundException("Error");
        }
    }

    @Transactional
    public List<OrderResponse> viewOrderByStatusAndEmpId(StatusInfo status, String empId) {
        List<Orders> list = new ArrayList<>();
        try {
            List<Status> statuses = statusRepository.findByStatusInfo(status);

            for (Status s : statuses) {
                Orders orders = s.getOrders();
                if (orders.getStatus().getLast().getStatusInfo() == status
                        && orders.getStatus().getLast().getEmpId().equals(empId)) {
                    list.add(orders);
                }
            }
            if (list.isEmpty()) {
                return new ArrayList<>();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new NotFoundException("Error");
        }
        return list.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            orderResponse.setPayment(order.getPayment().getStatus());
            return orderResponse;
        }).toList();
    }

    public OrderListAndTotal viewOrderByStatusAndEmpIdAndTotal(StatusInfo status, String empId){
        OrderListAndTotal orderListAndTotal = new OrderListAndTotal();
        orderListAndTotal.setTotal(0);
        orderListAndTotal.setListOrders(new ArrayList<>());
        try{
            List<OrderResponse> orderList = viewOrderByStatusAndEmpId(status,empId);
            orderListAndTotal.setListOrders(orderList);
            orderListAndTotal.setTotal(orderList.size());
        }catch (Exception e){
            e.printStackTrace();
            throw new NotFoundException("Error");
        }
        return orderListAndTotal;
    }

    @Transactional
    public TotalOrderOfEmp getTotalByEmpUsername(StatusInfo status, String username){
        Account emp = accountRepository.findByUsername(username);
        TotalOrderOfEmp result = new TotalOrderOfEmp();
        try {
            result.setTotal(viewOrderByStatusAndEmpIdAndTotal(status, emp.getId()).getTotal());
        }catch (Exception e){
            throw new NotFoundException("Error");
        }
        return result;
    }

    public List<OrderHistoryResponse> viewOrderByAccount(String username) {
        try {
            Account account = accountRepository.findByUsername(username);
            List<Orders> list = orderRepository.findByAccount(account);
            list.sort((o1, o2) -> o2.getStatus().getFirst().getDate().compareTo(o1.getStatus().getFirst().getDate()));
            return list.stream().map(order -> {
                OrderHistoryResponse orderResponse = modelMapper.map(order, OrderHistoryResponse.class);
                orderResponse.setStatus(order.getStatus().getLast().getStatusInfo().toString());
                orderResponse.setOrderCreateDate(order.getStatus().getFirst().getDate());
                if (order.getStatus().getLast().getStatusInfo() == StatusInfo.SUCCESS) {
                    orderResponse.setActDeliveryDate(order.getActDeliveryDate());
                }
                orderResponse.setFeedback(order.getFeedbacks() != null);
                orderResponse.setPaid(order.getPayment().getStatus().equals(Paystatus.PAYED.toString()));
                return orderResponse;
            }).toList();
        } catch (Exception e) {
            throw new NotFoundException("Error");
        }
    }

    public void createOrdersFromJson(String jsonArray) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<OrderRequest> orders = objectMapper.readValue(jsonArray, objectMapper.getTypeFactory().constructCollectionType(List.class, OrderRequest.class));
            for (OrderRequest order : orders) {
                createOrder(order);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create orders from JSON array", e);
        }
    }

    public String updateImage(OrderImageRequest orderImageRequest) {
        Orders existingOrder = orderRepository.findByorderID(orderImageRequest.getOrderId());
        if (existingOrder == null) {
            throw new NotFoundException("Not found!");
        }
        try {
            existingOrder.setImage(orderImageRequest.getImage());
            orderRepository.save(existingOrder);
            return "Image updated successfully";
        } catch (Exception e) {
            throw new DuplicateException("Update fail");
        }
    }

    @Transactional
    public List<Orders> getOrderWaitingToLong() {
        try {
            List<Orders> orders = viewOrderByStatus(StatusInfo.WAITING);
            List<Orders> list = new ArrayList<>();
            Date currentDate = new Date();
            for (Orders order : orders) {
                int waitDate = DateConversionUtil.calculateTimeDifference(currentDate, order.getStatus().getFirst().getDate());
                if (waitDate > 4) { // tg chờ lớn hơn 4 ngày
                    list.add(order);
                }
            }
            return list;
        } catch (Exception e) {
            throw new NotFoundException("Can't get order waiting too long because of error");
        }
    }

    public String updateRefund(String orderId){
        Orders order = orderRepository.findByorderID(orderId);
        if (order == null) {
            throw new NotFoundException("Not found this order");
        }
        try {
            StatusRequest statusRequest = new StatusRequest();
            statusRequest.setOrder(orderId);
            statusRequest.setStatusInfo(StatusInfo.REFUNDED.toString());
            statusRequest.setDescription("Refund successful");
            statusRequest.setEmpId(authenticationService.getCurrentAccount().getId());
            statusService.createStatus(statusRequest);
            orderRepository.save(order);
        } catch (Exception e) {
            throw new DuplicateException("Unexpected error!");
        }
        return "Update refund successfully";
    }

    public String updateAllOrder() {
        orderRepository.findAll().forEach(order -> {
            String address = order.getSenderAddress();
            String[] list =address.trim().split(",");
            if (list[list.length - 1].matches("Thành phố Hồ Chí Minh") || list[list.length - 1].matches(" Hồ Chí Minh") || list[list.length - 1].matches(" TP.HCM")) {
                list[list.length - 1] = " Thành phố Hồ Chí Minh";
            }
            address = String.join(",", list);
            order.setSenderAddress(address);
            orderRepository.save(order);
        });
        return "Update all orders successfully";
    }

    public boolean deleteOrder(String id) {
        OrderDetail orderDetail = orderDetailRepository.findOrderDetailByOrdersOrderID(id);
        Orders order = orderRepository.findByorderID(id);
        if (order == null) {
            throw new NotFoundException("Not found this order");
        }
        try {
            if (orderDetail != null) {
                orderDetailRepository.delete(orderDetail);
            }
            orderRepository.delete(order);
            return true;
        } catch (Exception e) {
            throw new DuplicateException("Unexpected error!");
        }
    }
}

