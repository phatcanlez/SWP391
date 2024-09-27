package com.example.SWP391.api;

import com.example.SWP391.entity.License;
import com.example.SWP391.service.LicenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/license")
@RestController
public class LicenseAPI {

    @Autowired
    private LicenseService licenseService;

    @PostMapping("/create")
    public ResponseEntity createLicense(@Valid @RequestBody License license) {
        License newLicense = licenseService.createLicense(license);
        return ResponseEntity.ok(newLicense);
    }

    @GetMapping("/get")
    public void getAllLicense() {
        // Some code here
    }

    @GetMapping("/get/{id}")
    public void getLicenseById() {

    }


    @PutMapping("/update")
    public void updateLicense() {
        // Some code here
    }

}