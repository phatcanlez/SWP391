package com.example.SWP391.controller;

import com.example.SWP391.entity.License;
import com.example.SWP391.service.LicenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin("*")
public class LicenseAPI {

        @Autowired
        private LicenseService licenseService;

        @PostMapping("/api/licence")
        public ResponseEntity createLicense(@Valid @RequestBody License license) {
            License newLicense = licenseService.createLicense(license);
            return ResponseEntity.ok(newLicense);
        }

        @GetMapping("/api/licence")
        public void getAllLicense() {
            // Some code here
        }

        @GetMapping("/api/licence/{id}")
        public void getLicenseById() {
            // Some code here
        }


        @PutMapping("/api/licence")
        public void updateLicense() {
            // Some code here
        }

}
