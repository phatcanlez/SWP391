package com.example.SWP391.controller;

import com.example.SWP391.entity.Feedback;
import com.example.SWP391.model.DTO.feedbackDTO.FeedbackRequest;
import com.example.SWP391.model.DTO.feedbackDTO.FeedbackResponse;
import com.example.SWP391.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class FeedbackAPI {
    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/api/feedback")
    public ResponseEntity createFeedback(@Valid @RequestBody FeedbackRequest feedbackRequest) {
        return ResponseEntity.ok(feedbackService.createFeedback(feedbackRequest));
    }

    @GetMapping("/api/feedback")
    public ResponseEntity getAllFeedbacks() {
        List<FeedbackResponse> list = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/api/feedback/{id}")
    public ResponseEntity getFeedbackById(@PathVariable int id) {
        return ResponseEntity.ok(feedbackService.viewFeedbackById(id));
    }


    @PutMapping("/api/feedback/{id}")
    public ResponseEntity updateFeedback(@RequestBody @Valid FeedbackRequest feedback, int id) {
        return ResponseEntity.ok(feedbackService.updateFeedback(feedback, id));
    }
}
