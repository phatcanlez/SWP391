package com.example.SWP391.service;



import com.example.SWP391.entity.Payment;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.paymentDTO.PaymentRequest;
import com.example.SWP391.repository.PaymentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<Payment> getAllPayment(){
        List<Payment> list = paymentRepository.findAll();
        return list;
    }

    public Payment createPayment(PaymentRequest paymentRequest){
        try{
            Payment payment = modelMapper.map(paymentRequest, Payment.class);
            payment.setTimeOfPay(new Date(System.currentTimeMillis()));
            return paymentRepository.save(payment);
        }catch (Exception e){
            throw new DuplicateException("This payment is existed!!");
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

    public Payment updatePayment(PaymentRequest paymentRequest, long Id){
        Payment oldPayment = paymentRepository.findPaymentByPaymentId(Id);
        if(oldPayment == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldPayment.setTimeOfPay(new Date(System.currentTimeMillis()));
            oldPayment.setTypeOfPay(paymentRequest.getTypeOfPay());
            oldPayment.setStatus(paymentRequest.getStatus());
            return paymentRepository.save(oldPayment);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }


}
