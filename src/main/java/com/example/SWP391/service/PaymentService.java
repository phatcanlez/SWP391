package com.example.SWP391.service;



import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Payment;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.EmailDetail;
import com.example.SWP391.model.DTO.paymentDTO.PaymentRequest;
import com.example.SWP391.model.Enum.PayType;
import com.example.SWP391.model.Enum.Paystatus;
import com.example.SWP391.model.Enum.StatusInfo;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    EmailService emailService;

    public List<Payment> getAllPayment(){
        List<Payment> list = paymentRepository.findAll();
        return list;
    }

    @Transactional
    public List<Payment> getPaymentByStatus(String status){
        List<Payment> list = paymentRepository.findPaymentByStatus(status);
        return list;
    }

    public Payment createPayment(PaymentRequest paymentRequest){
        try{
            Payment payment = modelMapper.map(paymentRequest, Payment.class);
            payment.setTimeOfPay(new Date(System.currentTimeMillis()));
            payment.setTypeOfPay(PayType.BANKING.toString());
            return paymentRepository.save(payment);
        }catch (Exception e){
            throw new DuplicateException("This payment is existed!!");
        }
    }

    public Payment updatePaymentToFail(long id){
        Payment payment = paymentRepository.findPaymentByPaymentId(id);
        if(payment == null){
            throw new NotFoundException("Not found this payment");
        }
        if(payment.getStatus().equals(StatusInfo.SUCCESS.toString())){
            throw new DuplicateException("This payment is successful!");
        }
        try{
            payment.setTypeOfPay(PayType.BANKING.toString());
            payment.setTimeOfPay(new Date(System.currentTimeMillis()));
            payment.setStatus(Paystatus.CANCEL.toString());
            paymentRepository.save(payment);
            return payment;
        }catch (Exception e){
            throw new DuplicateException("Update set payment to fail have error");
        }
    }

    public Payment viewPaymentById(long id){
        Payment payment = paymentRepository.findPaymentByPaymentId(id);
        if(payment == null){
            throw new DuplicateException("Not found this payment");
        }
        else{
            return payment;
        }
    }

    public String updatePayment(String orderId){
        Payment oldPayment = orderRepository.findByorderID(orderId).getPayment();
        if(oldPayment == null){
            throw new NotFoundException("Not found!");
        }
        if(oldPayment.getStatus().equals(StatusInfo.SUCCESS.toString())){
            throw new DuplicateException("This payment is success!");
        }
        try{
            oldPayment.setTimeOfPay(new Date(System.currentTimeMillis()));
            oldPayment.setTypeOfPay(PayType.BANKING.toString());
            oldPayment.setStatus(Paystatus.UNPAYED.toString());
            paymentRepository.save(oldPayment);
            return createURL(orderId);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }

    public Payment updatePaymentStatus(String orderId){

        Payment payment = orderRepository.findByorderID(orderId).getPayment();
        if(payment == null){
            throw new NotFoundException("Not found!");
        }
        if(payment.getStatus().equals(StatusInfo.SUCCESS.toString())){
            throw new DuplicateException("This payment was successful!");
        }
        try{
                payment.setStatus(StatusInfo.SUCCESS.toString());
                payment.setTimeOfPay(new Date(System.currentTimeMillis()));
                paymentRepository.save(payment);
                EmailDetail emailDetail = new EmailDetail();
                emailDetail.setReceiver(authenticationService.getCurrentAccount());
                emailDetail.setSubject("Payment success");
                emailDetail.setButton("Go home page");
                emailDetail.setLink("http://koikichi.io.vn");
                emailDetail.setContent("The payment of order: " + orderId +" is successful, thank you for using our service");
                emailService.sendEmail(emailDetail);
            return payment;
        }catch (Exception e){
            throw new DuplicateException("Update status fail");
        }
    }

    public String createURL(String orderId) throws Exception {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        LocalDateTime createdDate = LocalDateTime.now();
        String formattedDateTime = createdDate.format(formatter);

        //code thanh toan
        Orders order = orderRepository.findByorderID(orderId);
        double money = order.getTotalPrice() * 100;  // Vnp requires the amount * 100 and no decimal //đây là tiền đô

        String amount = String.valueOf((int) money);

        String tmnCode = "FCQGXYEF";
        String secretKey = "5DHWJUAO6ELG2KFHDGET7OCSEK9NF33R";
        String vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        String returnUrl = "http://koikichi.io.vn/pay-success/?orderId=" + order.getOrderID();
        String currCode = "VND";

        Map<String, String> vnp_Params = new TreeMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", tmnCode);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_CurrCode", currCode);
        vnp_Params.put("vnp_TxnRef", order.getOrderID().toString());
        vnp_Params.put("vnp_OrderInfo", "Thanh toan cho ma giao dich: " + order.getOrderID());
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Amount", amount);
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_CreateDate", formattedDateTime);
        vnp_Params.put("vnp_IpAddr", "192.168.101.19");// thanh toan thanh cong

        StringBuilder signDataBuilder = new StringBuilder();
        for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
            signDataBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            signDataBuilder.append("=");
            signDataBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
            signDataBuilder.append("&");
        }
        signDataBuilder.deleteCharAt(signDataBuilder.length() - 1); //remove last "$"
        String signData = signDataBuilder.toString();

        String singed = generateHMAC(secretKey, signData);

        vnp_Params.put("vnp_SecureHash", singed);

        StringBuilder urlBuilder = new StringBuilder(vnpUrl);
        urlBuilder.append("?");
        for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
            urlBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("=");
            urlBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("&");
        }
        urlBuilder.deleteCharAt(urlBuilder.length() - 1); //remove last "$"
        return urlBuilder.toString();
    }

    private String generateHMAC(String secretKey, String data) throws Exception {
        Mac hmacSha512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmacSha512.init(keySpec);
        byte[] hmacBytes = hmacSha512.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder result = new StringBuilder();
        for (byte b : hmacBytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

}
