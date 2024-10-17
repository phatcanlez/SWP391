package com.example.SWP391.model.DTO.feedbackDTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FeedbackUpdateRequest {

    @Min(value = 1, message = "Feedback ID must be greater than 0")
    int feedbackId;

    @Min(value = 1, message = "Star rating must be greater than 0")
    @Max(value = 5, message = "Star rating must be less than 6")
    int rating;

    @Size(min = 0, max = 200, message = "Feedback must be between 0 and 200 characters")
    String comment;
}
