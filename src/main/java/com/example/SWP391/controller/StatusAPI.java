package com.example.SWP391.controller;


import com.example.SWP391.model.DTO.OrderDTO.ResponseMessage;
import com.example.SWP391.model.DTO.statusDTO.StatusRequest;
import com.example.SWP391.service.StatusService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class StatusAPI {

    @Autowired
    StatusService statusService;

    @Autowired
    ModelMapper modelMapper;

    @PostMapping("/api/status")
    public ResponseEntity createStatus(@RequestBody @Valid StatusRequest statusRequest) {
        try {
            return ResponseEntity.ok(statusService.createStatus(statusRequest));
        } catch (Exception e) {
            ResponseMessage responseMessage = new ResponseMessage();
            responseMessage.setMessage(e.getMessage());
            return ResponseEntity.status(400).body(responseMessage);
        }
    }

//    @GetMapping("/api/status")
//    public ResponseEntity getAllStatus() {
//        return ResponseEntity.ok(statusService.getAllStatus());
//    }

    @GetMapping("/api/status/{id}")
    public ResponseEntity getLicenseById(@PathVariable long id) {
        return ResponseEntity.ok(statusService.viewStatusById(id));
    }

    @PutMapping("/api/status/{id}")
    public ResponseEntity updateStatus(StatusRequest statusRequest,@PathVariable long Id) {
        return ResponseEntity.ok(statusService.updateStatus(statusRequest, Id));
    }
}
