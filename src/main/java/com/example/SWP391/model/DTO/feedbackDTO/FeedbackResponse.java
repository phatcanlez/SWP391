package com.example.SWP391.model.DTO.feedbackDTO;

import lombok.Data;

@Data
public class FeedbackResponse {
    private int feedbackId;
    private int rating;
    private String description;
    private String feedbackDate;
    private String orderID;
}
