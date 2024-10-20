package com.example.SWP391.model.DTO.reportDTO;

import com.example.SWP391.entity.Feedback;
import com.example.SWP391.entity.Report;
import lombok.Data;

import java.util.List;

@Data
public class ReportResponsePage {
    List<Report> content;
    int pageNumbers;
    long totalElements;
    int totalPages;
    int nummberOfElement;
}
