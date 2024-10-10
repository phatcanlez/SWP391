package com.example.SWP391.service;


import com.example.SWP391.entity.Report;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.reportDTO.ReportRequest;
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

    public List<Report> getAllReport(){
        List<Report> list = reportRepository.findAll();
        return list;
    }

    public Report createReport(ReportRequest reportRequest){
        try{
            Report report = modelMapper.map(reportRequest, Report.class);
            report.setTime(new Date(System.currentTimeMillis()));
            return reportRepository.save(report);
        }catch (Exception e){
            throw new DuplicateException("This report price is existed!!");
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

    public Report updateReport(ReportRequest reportRequest, long Id){
        Report oldReport = reportRepository.findReportById(Id);
        if(oldReport == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldReport.setReportContent(reportRequest.getReportContent());
            oldReport.setStatus(reportRequest.getStatus());
            return reportRepository.save(oldReport);
        }catch (Exception e){
            throw new DuplicateException("Update fail");
        }
    }


}
