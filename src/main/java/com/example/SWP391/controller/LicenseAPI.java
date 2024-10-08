package com.example.SWP391.controller;

import com.example.SWP391.entity.License;
import com.example.SWP391.model.DTO.License.DTO.LicenseRequest;
import com.example.SWP391.service.LicenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
public class LicenseAPI {

    @Autowired
    private LicenseService licenseService;

    @PostMapping("/api/licence")
    public ResponseEntity createLicense(@Valid @RequestBody LicenseRequest license) {
        License newLicense = licenseService.createLicense(license);
        return ResponseEntity.ok(newLicense);
    }

    @GetMapping("/api/licence")
    public ResponseEntity getAllLicense() {
        List<License> list = licenseService.getAllLicense();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/api/licence/{id}")
    public ResponseEntity getLicenseById(@PathVariable long id) {
        License license = licenseService.viewEmployeeById(id);
        return ResponseEntity.ok(license);
    }


    @PutMapping("/api/licence-update")
    public ResponseEntity updateLicense(@RequestBody @Valid LicenseRequest license, long id) {
        return ResponseEntity.ok(licenseService.updateLicense(license, id));
    }

}
