package com.example.SWP391.controller;

import com.example.SWP391.entity.ExtraService;
import com.example.SWP391.service.ExtraServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("*")
public class ExtraServiceAPI {

        @Autowired
        private ExtraServiceService extraServiceService;

        @PostMapping("/api/extraservice")
        public ResponseEntity createExtraService(@Valid @RequestBody ExtraService extraService) {
            return ResponseEntity.ok(extraServiceService.createExtraService(extraService));
        }

        @GetMapping("/api/extraservice")
        public ResponseEntity getAllExtraService() {
                List<ExtraService> list = extraServiceService.getAllExtraService();
                return ResponseEntity.ok(list);
        }

        @GetMapping("/api/extraservice/{id}")
        public ResponseEntity getLicenseById(@PathVariable long id) {
            return ResponseEntity.ok(extraServiceService.viewExtraServiceById(id));
        }


        @PutMapping("/api/extraservice")
        public ResponseEntity updateLicense(@RequestBody @Valid ExtraService extraService, long id) {
            return ResponseEntity.ok(extraServiceService.updateExtraService(extraService, id));
        }

}
