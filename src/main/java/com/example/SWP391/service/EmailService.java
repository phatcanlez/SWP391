package com.example.SWP391.service;


import com.example.SWP391.entity.Orders;
import com.example.SWP391.model.DTO.EmailDetail;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    TemplateEngine templateEngine;

    @Autowired
    JavaMailSender javaMailSender;

    public void sendEmail(EmailDetail emailDetail){
        try {
             Context context = new Context();
             context.setVariable("name",emailDetail.getReceiver().getEmail());
             context.setVariable("button",emailDetail.getButton());
             context.setVariable("link",emailDetail.getLink());
             context.setVariable("content",emailDetail.getContent());
            context.setVariable("subject",emailDetail.getSubject());

             String template = templateEngine.process("welcome-template", context);

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);

            mimeMessageHelper.setFrom("Koikichi@gmail.com");
            mimeMessageHelper.setTo(emailDetail.getReceiver().getEmail());
            mimeMessageHelper.setSubject(emailDetail.getSubject());
            mimeMessageHelper.setText(template, true);
            javaMailSender.send(mimeMessage);
        }catch (MessagingException e){
            e.printStackTrace();
        }
    }

    public void sendEmailErrorRuntime(String emailDetail){
        try {
            Context context = new Context();
            context.setVariable("name","phatcanlez@gmail.com");
            context.setVariable("button","Error");
            context.setVariable("link","Bug!!!!!!!!!!!");
            context.setVariable("content",emailDetail);
            context.setVariable("subject","Error Runtime at " + java.time.LocalDateTime.now());

            String template = templateEngine.process("welcome-template", context);
            //

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);

            mimeMessageHelper.setFrom("Koikichi@gmail.com");
            mimeMessageHelper.setTo("phatcanlez@gmail.com");
            mimeMessageHelper.setSubject("Error Runtime");
            mimeMessageHelper.setText(template, true);
            javaMailSender.send(mimeMessage);
        }catch (MessagingException e){
            e.printStackTrace();
        }
    }

    public void sendEmailOrderIsWaitingTooLong(Orders orders){
        EmailDetail emailDetail = new EmailDetail();
        emailDetail.setReceiver(orders.getAccount());
        emailDetail.setSubject("Your order is waiting too long");
        emailDetail.setContent("Your order is waiting too long, we don't have any employee to deliver your order. Please wait for about 7 days, we will approve your order as soon as possible");
        emailDetail.setLink("");
        emailDetail.setButton("Apologize");
        sendEmail(emailDetail);
    }

    public void sendEmailNoEmp(Orders orders){
        EmailDetail emailDetail = new EmailDetail();
        emailDetail.setReceiver(orders.getAccount());
        emailDetail.setSubject("There is no employee to deliver your order");
        emailDetail.setContent("We don't have any employee to deliver your order. Please wait for a while");
        emailDetail.setLink("");
        emailDetail.setButton("Apologize");
        sendEmail(emailDetail);
    }

}
