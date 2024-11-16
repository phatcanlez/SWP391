package com.example.SWP391.service;

import com.example.SWP391.entity.Feedback;
import com.example.SWP391.entity.Orders;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;


import com.example.SWP391.model.DTO.OrderDTO.OrderRequest;
import com.example.SWP391.model.DTO.feedbackDTO.FeedbackRequest;
import com.example.SWP391.model.DTO.feedbackDTO.FeedbackResponse;
import com.example.SWP391.model.DTO.feedbackDTO.FeedbackResponsePage;
import com.example.SWP391.model.DTO.feedbackDTO.FeedbackUpdateRequest;
import com.example.SWP391.repository.FeedbackRepository;
import com.example.SWP391.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    OrderRepository orderRepository;

    public FeedbackResponsePage getAllFeedbacks(int page, int size) {
        Page<Feedback> list = feedbackRepository.findAll(PageRequest.of(page, size));
        Page<FeedbackResponse> listR = list.map(feedback -> {
            FeedbackResponse feedbackResponse = modelMapper.map(feedback, FeedbackResponse.class);
            feedbackResponse.setOrderID(feedback.getOrders().getOrderID());
            return feedbackResponse;});
         FeedbackResponsePage feedbackResponsePage = new FeedbackResponsePage();
         feedbackResponsePage.setContent(listR.getContent());
         feedbackResponsePage.setTotalPages(list.getTotalPages());
         feedbackResponsePage.setTotalElements(list.getTotalElements());
         feedbackResponsePage.setPageNumbers(list.getNumber());
         feedbackResponsePage.setNummberOfElement(list.getNumberOfElements());
         return feedbackResponsePage;
    }

    public FeedbackResponse createFeedback(FeedbackRequest feedback) {
        try {
            Orders order = orderRepository.findByorderID(feedback.getOrderID());
            if (order.getFeedbacks().isEmpty()) {
                Feedback newFeedback = new Feedback();
                newFeedback.setRating(feedback.getRating());
                newFeedback.setComment(feedback.getComment());
                newFeedback.setTime(new Date(System.currentTimeMillis()));
                newFeedback.setOrders(orderRepository.findByorderID(feedback.getOrderID()));
                feedbackRepository.save(newFeedback);
                FeedbackResponse feedbackResponse = modelMapper.map(newFeedback, FeedbackResponse.class);
                feedbackResponse.setOrderID(newFeedback.getOrders().getOrderID());

                return feedbackResponse;
            }else {
                throw new Exception();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new DuplicateException("This order already has feedback");
        }
    }

    public void createFeedbackFromJson(String jsonArray) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<FeedbackRequest> feedbacks = objectMapper.readValue(jsonArray, objectMapper.getTypeFactory().constructCollectionType(List.class, FeedbackRequest.class));
            for (FeedbackRequest feedbackRequest : feedbacks) {
                createFeedback(feedbackRequest);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create orders from JSON array", e);
        }
    }

    public FeedbackResponse viewFeedbackById(String orderId) {
        Orders order = orderRepository.findByorderID(orderId);
        List<Feedback>  feedbacks = feedbackRepository.findFeedbackByOrders(order);

        if (feedbacks.isEmpty()) {
            throw new DuplicateException("Not found this feedback");
        } else {
            FeedbackResponse feedbackResponse = modelMapper.map(feedbacks.getLast(), FeedbackResponse.class);
            feedbackResponse.setOrderID(feedbacks.getLast().getOrders().getOrderID());
            return feedbackResponse;
        }
    }

    public FeedbackResponse updateFeedback(FeedbackUpdateRequest feedback) {
        Feedback oldFeedback = feedbackRepository.findFeedbackByFeedbackId(feedback.getFeedbackId());
        if (oldFeedback == null) {
            throw new NotFoundException("Not found!");
        }
        try {
            oldFeedback.setRating(feedback.getRating());
            oldFeedback.setComment(feedback.getComment());
            FeedbackResponse feedbackResponse = modelMapper.map(feedbackRepository.save(oldFeedback), FeedbackResponse.class);
            feedbackResponse.setOrderID(oldFeedback.getOrders().getOrderID());

            return feedbackResponse;
        } catch (Exception e) {
            throw new DuplicateException("Invalid data");
        }
    }
}
