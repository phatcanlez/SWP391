package com.example.SWP391.controller;

import com.example.SWP391.model.DTO.reportDTO.ReportRequest;
import com.example.SWP391.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class ReportAPI {

    @Autowired
    ReportService reportService;

    @PostMapping("/api/report")
    public ResponseEntity createReport(@RequestBody @Valid ReportRequest reportRequest) {
        return ResponseEntity.ok(reportService.createReport(reportRequest));
    }

    @GetMapping("/api/report")
    public ResponseEntity getAllReport() {
        return ResponseEntity.ok(reportService.getAllReport());
    }

    @GetMapping("/api/report/{id}")
    public ResponseEntity getLicenseById(@PathVariable long id) {
        return ResponseEntity.ok(reportService.viewReportById(id));
    }

    @PutMapping("/api/report")
    public ResponseEntity updateReport(ReportRequest reportRequest, long Id) {
        return ResponseEntity.ok(reportService.updateReport(reportRequest, Id));
    }
}
