package com.example.SWP391.model.DTO.feedbackDTO;

import com.example.SWP391.entity.Account;
import com.example.SWP391.entity.Feedback;
import lombok.Data;

import java.util.List;

@Data
public class FeedbackResponsePage {
    List<Feedback> content;
    int pageNumbers;
    long totalElements;
    int totalPages;
    int nummberOfElement;
}
