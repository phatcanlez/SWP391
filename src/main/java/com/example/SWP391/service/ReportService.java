package com.example.SWP391.service;


import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Report;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.reportDTO.ReportRequest;
import com.example.SWP391.model.DTO.reportDTO.ReportResponse;
import com.example.SWP391.model.DTO.reportDTO.ReportResponsePage;
import com.example.SWP391.model.DTO.reportDTO.ReportUpdateRequest;
import com.example.SWP391.model.Enum.ReportStatus;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.repository.ReportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    ModelMapper modelMapper;

    public List<ReportResponse> getAllReport(){
        List<Report> list = reportRepository.findAll();
        return list.stream().map(report -> {
            ReportResponse reportResponse = modelMapper.map(report, ReportResponse.class);
            reportResponse.setOrderId(report.getOrders().getOrderID());
            return reportResponse;
        }).toList();
    }

    public ReportResponsePage getAllReportWithPage(int page, int size){
        Page<Report> reports = reportRepository.findAll(PageRequest.of(page, size));
        Page<ReportResponse> reportResponses = reports.map(report -> {
            ReportResponse reportResponse = modelMapper.map(report, ReportResponse.class);
            reportResponse.setOrderId(report.getOrders().getOrderID());
            return reportResponse;
        });
        ReportResponsePage reportResponsePage = new ReportResponsePage();
        reportResponsePage.setContent(reportResponses.getContent());
        reportResponsePage.setPageNumbers(reports.getNumber());
        reportResponsePage.setTotalElements(reports.getTotalElements());
        reportResponsePage.setTotalPages(reports.getTotalPages());
        reportResponsePage.setNummberOfElement(reports.getNumberOfElements());
        return reportResponsePage;
    }

    public Report createReport(ReportRequest reportRequest){
        try{
            List<Report> reports = orderRepository.findByorderID(reportRequest.getOrder()).getReports();
            if (!reports.isEmpty()){
                throw new DuplicateException("This report is existed!!");
            }
            Report report = modelMapper.map(reportRequest, Report.class);
            report.setOrders(orderRepository.findByorderID(reportRequest.getOrder()));
            report.setTime(new Date(System.currentTimeMillis()));
            report.setStatus(ReportStatus.UNREPLIED + "");
            report.setEmployeeId("");
            report.setEmpReply("");
            return reportRepository.save(report);
        }catch (Exception e){
            throw new DuplicateException("This report is existed!!");
        }
    }

    public void createReportFromJson(String jsonArray) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<ReportRequest> orders = objectMapper.readValue(jsonArray, objectMapper.getTypeFactory().constructCollectionType(List.class, ReportRequest.class));
            for (ReportRequest order : orders) {
                createReport(order);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create orders from JSON array", e);
        }
    }

    public Report viewReportById(long id){
        Report report = reportRepository.findReportById(id);
        if(report == null){
            throw new DuplicateException("Not found this report");
        }
        else{
            return report;
        }
    }

    public ReportResponse viewReportByOrderId(String orderId){
        List<Report> reports = orderRepository.findByorderID(orderId).getReports();
        if(reports == null){
            throw new DuplicateException("Not found this report");
        }
        else{
            ReportResponse reportResponse = modelMapper.map(reports.getLast(), ReportResponse.class);
            reportResponse.setOrderId(reports.getLast().getOrders().getOrderID());
            return reportResponse;
        }
    }

    public Report updateReport(ReportUpdateRequest reportUpdateRequest){
        List<Report> reports = orderRepository.findByorderID(reportUpdateRequest.getOrderId()).getReports();
        Report oldReport = reports.getLast();
        if(oldReport == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldReport.setEmpReply(reportUpdateRequest.getEmpReply());
            oldReport.setStatus(ReportStatus.REPLIED + "");
            oldReport.setEmpReply(reportUpdateRequest.getEmpReply());
            oldReport.setEmployeeId(authenticationService.getCurrentAccount().getId());
            return reportRepository.save(oldReport);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }

    public List<ReportResponse> getReportByCustomerId(String customerId){
        Account account = authenticationService.getAccountById(customerId);
        List<Orders> orders = orderRepository.findByAccount(account);
        if (orders == null){
            throw new NotFoundException("Not found!");
        }
        List<Report> reports = new ArrayList<>();
        for (Orders order : orders){
            List<Report> report = order.getReports();
            if(!report.isEmpty()){
                reports.add(report.getLast());
            }
        }
        return reports.stream().map(report -> {
            ReportResponse reportResponse = modelMapper.map(report, ReportResponse.class);
            reportResponse.setOrderId(report.getOrders().getOrderID());
            return reportResponse;
        }).toList();
    }

}
