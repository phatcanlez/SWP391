package com.example.SWP391.controller;

import com.example.SWP391.entity.Status;
import com.example.SWP391.model.DTO.statusDTO.StatusRequest;
import com.example.SWP391.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class StatusAPI {

    @Autowired
    StatusService statusService;

    @PostMapping("/api/status")
    public ResponseEntity createStatus(StatusRequest statusRequest) {
        return ResponseEntity.ok(statusService.createStatus(statusRequest));
    }

    @GetMapping("/api/status")
    public ResponseEntity getAllStatus() {
        return ResponseEntity.ok(statusService.getAllStatus());
    }
}
