package com.example.SWP391.model.DTO.FeedbackDTO;

import lombok.Data;

@Data
public class FeedbackResponse {
    private int feedbackId;
    private int rating;
    private String description;
    private String feedbackDate;
    private String orderID;
}
