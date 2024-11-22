package com.example.SWP391.controller;

import com.example.SWP391.entity.Feedback;
import com.example.SWP391.model.DTO.feedbackDTO.FeedbackRequest;
import com.example.SWP391.model.DTO.feedbackDTO.FeedbackResponse;
import com.example.SWP391.model.DTO.feedbackDTO.FeedbackUpdateRequest;
import com.example.SWP391.service.FeedbackService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class FeedbackAPI {
    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/api/feedback")
    public ResponseEntity createFeedback(@Valid @RequestBody FeedbackRequest feedbackRequest) {
        return ResponseEntity.ok(feedbackService.createFeedback(feedbackRequest));
    }

    @PostMapping("/api/feedback/create-from-json")
    public ResponseEntity<String> createFeedbackFromJson(@RequestBody String jsonArray) {
        try {
            feedbackService.createFeedbackFromJson(jsonArray);
            return ResponseEntity.ok("Feedback created successfully");
        } catch (Exception e) {

            return ResponseEntity.status(500).body("Failed to create orders from JSON array");
        }
    }

    @GetMapping("/api/feedback")
    public ResponseEntity getAllFeedbacks(@RequestParam int page, @RequestParam int size) {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks(page, size));
    }

    @GetMapping("/api/feedback/{orderId}")
    public ResponseEntity getFeedbackById(@PathVariable String orderId) {
        return ResponseEntity.ok(feedbackService.viewFeedbackById(orderId));
    }

    @PutMapping("/api/feedback")
    public ResponseEntity updateFeedback(@RequestBody @Valid FeedbackUpdateRequest feedback) {
        return ResponseEntity.ok(feedbackService.updateFeedback(feedback));
    }
}
