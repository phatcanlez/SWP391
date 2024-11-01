package com.example.SWP391.controller;

import com.example.SWP391.entity.License;
import com.example.SWP391.model.DTO.License.DTO.LicenseRequest;
import com.example.SWP391.service.LicenseService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class LicenseAPI {

    @Autowired
    private LicenseService licenseService;

    @PostMapping("/api/licence")
    public ResponseEntity createLicense(@Valid @RequestBody LicenseRequest license) {
        License newLicense = licenseService.createLicense(license);
        return ResponseEntity.ok(newLicense);
    }

    @PostMapping("/api/license/create-from-json")
    public ResponseEntity<String> createLicenseFromJson(@RequestBody String jsonString) {
        try {
            licenseService.createLicenseFromJson(jsonString);
            return ResponseEntity.ok("License created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to create license from JSON string");
        }
    }

    @GetMapping("/api/licence")
    public ResponseEntity getAllLicense() {
        List<License> list = licenseService.getAllLicense();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/api/licence/id")
    public ResponseEntity getLicenseById(@RequestParam long id) {
        License license = licenseService.viewLicenseById(id);
        return ResponseEntity.ok(license);
    }

    @GetMapping("/api/licence/order-id")
    public ResponseEntity getLicenseByOrderId(@RequestParam String id) {
        return ResponseEntity.ok(licenseService.viewLicenseByOrderId(id));
    }

    @PutMapping("/api/licence/{id}")
    public ResponseEntity updateLicense(@RequestBody @Valid LicenseRequest license,@PathVariable long id) {
        return ResponseEntity.ok(licenseService.updateLicense(license, id));
    }

}
