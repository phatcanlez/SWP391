package com.example.SWP391.model.DTO.feedbackDTO;

import lombok.Data;

@Data
public class FeedbackResponse {
     int feedbackId;
     int rating;
     String comment;
     String time;
     String orderID;
}
