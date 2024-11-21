package com.example.SWP391.service;

import com.example.SWP391.entity.*;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.OrderDTO.*;
import com.example.SWP391.model.DTO.OrderDetailDTO.OrderDetailRequest;
import com.example.SWP391.model.DTO.statusDTO.StatusRequest;
import com.example.SWP391.model.Enum.OrderType;
import com.example.SWP391.model.Enum.Paystatus;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.*;
import com.example.SWP391.util.DateConversionUtil;
import com.example.SWP391.util.TrackingUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderOverseaRepository orderOverseaRepository;

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

//    @Autowired
//    OrderOverseaRepository overseaOrderRepository;

    @Autowired
    StatusService statusService;
    @Autowired
    ChatService chatService;


    public List<OrderResponse> viewOrderOversea(String empid, StatusInfo status) {
        List<OverseaOrder> order1 = orderOverseaRepository.findOrdersByEmployeeId1(empid);
        List<OverseaOrder> order2 = orderOverseaRepository.findOrdersByemployeeId2(empid);
        List<Orders> list = new ArrayList<>();
        for (OverseaOrder order : order1) {
            Orders orders = orderRepository.findByorderID(order.getOrderId());
            if (orders.getStatus().getLast().getStatusInfo().equals(status)) {
                list.add(orders);
            }
        }
        for (OverseaOrder order : order2) {
            Orders orders = orderRepository.findByorderID(order.getOrderId());
            if (orders.getStatus().getLast().getStatusInfo().equals(status)) {
                list.add(orders);
            }
        }
        return list.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            orderResponse.setPayment(order.getPayment().getStatus());
            orderResponse.setType(orderDetailService.viewOrderDetailById(order.getOrderID()).getType().toString());
            orderResponse.setName(order.getAccount().getName());
            orderResponse.setShipmethod(order.getOrderDetail().getShipMethod().getDescription());
            return orderResponse;
        }).toList();
    }

    public OrdersReponsePage getAllOrders(int page, int size) {
        Page<Orders> orders = orderRepository.findAll(PageRequest.of(page, size));
        List<OrderResponse> orderResponses = orders.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            orderResponse.setPayment(order.getPayment().getStatus());
            String type = String.valueOf(orderDetailService.viewOrderDetailById(order.getOrderID()).getType());
            orderResponse.setType(type);
            orderResponse.setName(order.getAccount().getName());
            orderResponse.setShipmethod(order.getOrderDetail().getShipMethod().getDescription());
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
            newOrder.setActDeliveryDate(null);
            if (order.getType().equals(OrderType.OVERSEA.toString())) {
                if (order.getShipMethod() == 3) {
                    newOrder.setExpDeliveryDate(DateConversionUtil.convertToDate(LocalDateTime.now().plusDays(8)));
                } else if (order.getShipMethod() == 2) {
                    newOrder.setExpDeliveryDate(DateConversionUtil.convertToDate(LocalDateTime.now().plusDays(10)));
                } else {
                    newOrder.setExpDeliveryDate(DateConversionUtil.convertToDate(LocalDateTime.now().plusDays(14)));
                }
            } else {
                if (order.getShipMethod() == 3) {
                    newOrder.setExpDeliveryDate(DateConversionUtil.convertToDate(LocalDateTime.now().plusDays(3)));
                } else if (order.getShipMethod() == 2) {
                    newOrder.setExpDeliveryDate(DateConversionUtil.convertToDate(LocalDateTime.now().plusDays(5)));
                } else {
                    newOrder.setExpDeliveryDate(DateConversionUtil.convertToDate(LocalDateTime.now().plusDays(7)));
                }
            }
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
            newOrder.setOrderDetail(orderDetailService.createOrderDetail(orderDetail));
            newOrder =  orderRepository.save(newOrder);
            OrderResponse orderResponse = modelMapper.map(newOrder, OrderResponse.class);
            orderResponse.setStatus(newOrder.getStatus().getLast());
            orderResponse.setPayment(newOrder.getPayment().getStatus());
            orderResponse.setType(order.getType());
            orderResponse.setName(newOrder.getAccount().getName());
            orderResponse.setShipmethod(newOrder.getOrderDetail().getShipMethod().getDescription());
            return orderResponse;
        } catch (NotFoundException e) {
            throw new NotFoundException(" Account not found");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new DuplicateException("Unexpected error!");
        }
    }

    public OrderRes viewOrderById(String id) {
        Orders order = orderRepository.findByorderID(id);
        if (order == null) {
            throw new NotFoundException("Not found this order");
        }
        OrderRes orderRes = modelMapper.map(order, OrderRes.class);
        orderRes.setSenderName(order.getAccount().getName());
        orderRes.setAccountId(order.getAccount().getId());
        orderRes.setUsername(order.getAccount().getUsername());
        if (order == null) {
            throw new NotFoundException("Not found this order");
        } else {
            return orderRes;
        }
    }

    public Orders updateOrder(OrderRequest order, String id) {
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
            List<Orders> list = new ArrayList<>();
            List<Status> statuses = statusRepository.findByStatusInfo(status);
            for (Status s : statuses) {
                if (s.getOrders().getStatus().getLast().getStatusInfo() == status) {
                    list.add(s.getOrders());
                }
            }
            return list;
        } catch (Exception e) {
            throw new NotFoundException("Error");
        }
    }

    @Transactional
    public List<OrderResponse> viewOrderByStatusAndEmpId(StatusInfo status, String empId) {
        Set<Orders> list = new HashSet<>();
        try {
            List<Status> statuses = statusRepository.findByStatusInfo(status);

            //xem đơn quốc tế
            List<OrderResponse> orders = viewOrderOversea(empId, status);
            if (!orders.isEmpty()) {
                for (OrderResponse o : orders) {
                    Orders order = orderRepository.findByorderID(o.getOrderID());
                    list.add(order);
                }
            }

            for (Status s : statuses) {
                Orders order = s.getOrders();
                if (order.getStatus().getLast().getStatusInfo().equals(status)
                        && order.getStatus().getLast().getEmpId().equals(empId)) {
                    list.add(order);
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
            orderResponse.setType(orderDetailService.viewOrderDetailById(order.getOrderID()).getType().toString());
            orderResponse.setName(order.getAccount().getName());
            orderResponse.setShipmethod(order.getOrderDetail().getShipMethod().getDescription());
            return orderResponse;
        }).toList();
    }

    public List<OrderResponse> viewOrderVN_JPByEmpId(String empId){
        Set<Orders> list = new HashSet<>();
        List<Orders> orders = orderRepository.findAll();
        for (Orders order : orders) {
            if (order.getStatus().getLast().getEmpId().equals(empId)) {
                if(order.getStatus().getLast().getStatusInfo().equals(StatusInfo.PENDINGJAPAN) || order.getStatus().getLast().getStatusInfo().equals(StatusInfo.PENDINGVIETNAM) || order.getStatus().getLast().getStatusInfo().equals(StatusInfo.APPROVEDJAPAN) || order.getStatus().getLast().getStatusInfo().equals(StatusInfo.ARRIVEDVIETNAM)){
                    list.add(order);
                }
            }
        }

        viewOrderOversea(empId, StatusInfo.APPROVEDJAPAN).forEach(order -> {
            Orders orders1 = orderRepository.findByorderID(order.getOrderID());
            list.add(orders1);
        });
        viewOrderOversea(empId, StatusInfo.PENDINGJAPAN).forEach(order -> {
            Orders orders1 = orderRepository.findByorderID(order.getOrderID());
            list.add(orders1);
        });
        viewOrderOversea(empId, StatusInfo.PENDINGVIETNAM).forEach(order -> {
            Orders orders1 = orderRepository.findByorderID(order.getOrderID());
            list.add(orders1);
        });
        viewOrderOversea(empId, StatusInfo.ARRIVEDVIETNAM).forEach(order -> {
            Orders orders1 = orderRepository.findByorderID(order.getOrderID());
            list.add(orders1);
        });

        return list.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            orderResponse.setPayment(order.getPayment().getStatus());
            orderResponse.setType(orderDetailService.viewOrderDetailById(order.getOrderID()).getType().toString());
            orderResponse.setName(order.getAccount().getName());
            orderResponse.setShipmethod(order.getOrderDetail().getShipMethod().getDescription());
            return orderResponse;
        }).toList();
    }

    public OrderListAndTotal viewOrderByStatusAndEmpIdAndTotal(StatusInfo status, String empId) {
        OrderListAndTotal orderListAndTotal = new OrderListAndTotal();
        orderListAndTotal.setTotal(0);
        orderListAndTotal.setListOrders(new ArrayList<>());
        try {
            List<OrderResponse> orderList = viewOrderByStatusAndEmpId(status, empId);
            orderListAndTotal.setListOrders(orderList);
            orderListAndTotal.setTotal(orderList.size());
        } catch (Exception e) {
            e.printStackTrace();
            throw new NotFoundException("Error");
        }
        return orderListAndTotal;
    }

    @Transactional
    public TotalOrderOfEmp getTotalByEmpUsername(StatusInfo status, String username) {
        Account emp = accountRepository.findByUsername(username);
        TotalOrderOfEmp result = new TotalOrderOfEmp();
        try {
            result.setTotal(viewOrderByStatusAndEmpIdAndTotal(status, emp.getId()).getTotal());
        } catch (Exception e) {
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
                orderResponse.setPaid(order.getPayment().getStatus().equals(Paystatus.SUCCESS.toString()));
                return orderResponse;
            }).toList();
        } catch (Exception e) {
            throw new NotFoundException("Error");
        }
    }

    public List<OrderResponse> viewOrderByOrderType(OrderType type) {
        List<OrderDetail> list = orderDetailRepository.findOrderDetailByType(type);
        if (list.isEmpty()) {
            return new ArrayList<>();
        }
        List<Orders> orders = new ArrayList<>();
        for (OrderDetail orderDetail : list) {
            orders.add(orderDetail.getOrders());
        }
        return orders.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            orderResponse.setPayment(order.getPayment().getStatus());
            orderResponse.setType(orderDetailService.viewOrderDetailById(order.getOrderID()).getType().toString());
            orderResponse.setName(order.getAccount().getName());
            orderResponse.setShipmethod(order.getOrderDetail().getShipMethod().getDescription());
            return orderResponse;
        }).toList();
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

    public String updateFinishImage(OrderImageRequest orderImageRequest) {
        Orders existingOrder = orderRepository.findByorderID(orderImageRequest.getOrderId());
        if (existingOrder == null) {
            throw new NotFoundException("Not found!");
        }
        try {
            existingOrder.setFinishImage(orderImageRequest.getImage());
            orderRepository.save(existingOrder);
            return "Imae updated successfully";
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

    public String updateRefund(String orderId) {
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
            String[] list = address.trim().split(",");
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

    public OrderResponsible viewOrderResponsible(String orderId) {
        Orders order = orderRepository.findByorderID(orderId);
        if (order == null) {
            throw new NotFoundException("Not found this order");
        }
        List<Status> listStatus = order.getStatus();
        Set<Account> listEmp = new HashSet<>();
        for (Status status : listStatus) {
            if (status.getEmpId() != null && !status.getEmpId().isEmpty() && !status.getEmpId().equals("")) {
                Account emp = accountRepository.findAccountById(status.getEmpId());
                listEmp.add(emp);
            }
        }
        OrderResponsible orderResponsible = new OrderResponsible();
        orderResponsible.setListEmployee(listEmp);
        orderResponsible.setTotalEmployee(listEmp.size());
        return orderResponsible;
    }

    public boolean checkStatus(String orderId, OrderType status) {
        Orders order = orderRepository.findByorderID(orderId);
        if (order == null) {
            throw new NotFoundException("Not found this order");
        }
        try {
            if (order.getOrderDetail().getType().equals(status)) {
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new NotFoundException("Error");
        }
    }

    public List<OrderResponse> viewOrderByStatusAndType(StatusInfo status, OrderType type) {
        List<Orders> listResult = new ArrayList<>();
        try {
            List<Orders> orders = viewOrderByStatus(status);
            for (Orders order : orders) {
                if (checkStatus(order.getOrderID(), type)) {
                    listResult.add(order);
                }
            }
        } catch (Exception e) {
            throw new NotFoundException("Error");
        }
        if (listResult.isEmpty()) {
            return new ArrayList<>();
        }
        return listResult.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            orderResponse.setPayment(order.getPayment().getStatus());
            orderResponse.setType(orderDetailService.viewOrderDetailById(order.getOrderID()).getType().toString());
            orderResponse.setName(order.getAccount().getName());
            orderResponse.setShipmethod(order.getOrderDetail().getShipMethod().getDescription());
            return orderResponse;
        }).toList();
    }

//    public List<OrderResponse>

    public List<OrderResponse> getAccWait2nd(String empId) {
        List<Orders> list = viewOrderByStatus(StatusInfo.WATINGFOR2NDSTAFF);
        List<Orders> listResult = new ArrayList<>();
        for (Orders order : list) {
            if (order.getStatus().getLast().getEmpId().equals(empId)) {
                listResult.add(order);
            }
        }
        if (listResult.isEmpty()) {
            throw new NotFoundException("");
        }
        return listResult.stream().map(order -> {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
            orderResponse.setStatus(order.getStatus().getLast());
            orderResponse.setPayment(order.getPayment().getStatus());
            orderResponse.setType(orderDetailService.viewOrderDetailById(order.getOrderID()).getType().toString());
            orderResponse.setName(order.getAccount().getName());
            orderResponse.setShipmethod(order.getOrderDetail().getShipMethod().getDescription());
            return orderResponse;
        }).toList();
    }
}

