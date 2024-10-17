package com.example.SWP391.controller;

import com.example.SWP391.model.DTO.reportDTO.ReportRequest;
import com.example.SWP391.model.DTO.reportDTO.ReportUpdateRequest;
import com.example.SWP391.service.ReportService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class ReportAPI {

    @Autowired
    ReportService reportService;

    @PostMapping("/api/report")
    public ResponseEntity createReport(@RequestBody @Valid ReportRequest reportRequest) {
        return ResponseEntity.ok(reportService.createReport(reportRequest));
    }

    @PostMapping("/api/report/create-from-json")
    public ResponseEntity<String> createReportFromJson(@RequestBody String jsonArray) {
        try {
            reportService.createReportFromJson(jsonArray);
            return ResponseEntity.ok("Orders created successfully");
        } catch (Exception e) {

            return ResponseEntity.status(500).body("Failed to create orders from JSON array");
        }
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
    public ResponseEntity updateReport(ReportUpdateRequest reportRequest, long Id) {
        return ResponseEntity.ok(reportService.updateReport(reportRequest, Id));
    }
}
