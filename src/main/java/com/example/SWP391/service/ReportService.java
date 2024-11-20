package com.example.SWP391.service;


import com.example.SWP391.entity.Report;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.reportDTO.ReportRequest;
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

    public ReportResponsePage getAllReport(int page, int size){
        Page<Report> reports = reportRepository.findAll(PageRequest.of(page, size));
        ReportResponsePage reportResponsePage = new ReportResponsePage();
        reportResponsePage.setContent(reports.getContent());
        reportResponsePage.setPageNumbers(reports.getNumber());
        reportResponsePage.setTotalElements(reports.getTotalElements());
        reportResponsePage.setTotalPages(reports.getTotalPages());
        reportResponsePage.setNummberOfElement(reports.getNumberOfElements());
        return reportResponsePage;
    }

    public Report createReport(ReportRequest reportRequest){
        try{
            Report report = modelMapper.map(reportRequest, Report.class);
            report.setOrders(orderRepository.findByorderID(reportRequest.getOrder()));
            report.setTime(new Date(System.currentTimeMillis()));
            report.setStatus(ReportStatus.UNREPLIED + "");
            report.setEmployeeId("");
            report.setEmpReply("");
            return reportRepository.save(report);
        }catch (Exception e){
            throw new DuplicateException("This report price is existed!!");
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

    public Report updateReport(ReportUpdateRequest reportUpdateRequest, long Id){
        Report oldReport = reportRepository.findReportById(Id);
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


}
