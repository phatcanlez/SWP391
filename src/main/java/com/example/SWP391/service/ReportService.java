package com.example.SWP391.service;


import com.example.SWP391.entity.Orders;
import com.example.SWP391.entity.Report;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.reportDTO.ReportRequest;
import com.example.SWP391.model.DTO.reportDTO.ReportResponse;
import com.example.SWP391.repository.OrderRepository;
import com.example.SWP391.repository.ReportRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    OrderRepository orderRepository;

    public List<ReportResponse> getAllReport(){
        List<Report> list = reportRepository.findAll();
        return list.stream().map(report -> modelMapper.map(report, ReportResponse.class)).toList();
    }

    public ReportResponse createReport(ReportRequest reportRequest){
        try{
            Orders order = orderRepository.findByorderID(reportRequest.getOrderID());
            Report report = modelMapper.map(reportRequest, Report.class);
            report.setOrders(order);
            report.setTime(new Date(System.currentTimeMillis()));
            return modelMapper.map(reportRepository.save(report), ReportResponse.class);
        }catch (Exception e){
            throw new DuplicateException("This report price is existed!!");
        }
    }

    public ReportResponse viewReportById(long id){
        Report report = reportRepository.findReportById(id);
        if(report == null){
            throw new DuplicateException("Not found this report");
        }
        else{
            return modelMapper.map(report, ReportResponse.class);
        }
    }

    public ReportResponse updateReport(ReportRequest reportRequest, long Id){
        Report oldReport = reportRepository.findReportById(Id);
        if(oldReport == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldReport.setReportContent(reportRequest.getReportContent());
            oldReport.setStatus(reportRequest.getStatus());
            return modelMapper.map(reportRepository.save(oldReport), ReportResponse.class);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }


}
