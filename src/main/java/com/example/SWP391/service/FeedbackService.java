package com.example.SWP391.service;

import com.example.SWP391.entity.Feedback;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.model.DTO.FeedbackDTO.FeedbackRequest;
import com.example.SWP391.model.DTO.FeedbackDTO.FeedbackResponse;
import com.example.SWP391.repository.FeedbackRepository;
import com.example.SWP391.repository.OrderRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<FeedbackResponse> getAllFeedbacks(){
        List<Feedback> list = feedbackRepository.findAll();
        modelMapper.map(list, FeedbackResponse.class);
        return list.stream().map(feedback -> modelMapper.map(feedback, FeedbackResponse.class)).toList();
    }

    public FeedbackResponse createFeedback(FeedbackRequest feedback){
        try{
            Feedback newFeedback = modelMapper.map(feedback, Feedback.class);
            newFeedback.setFeedbackDate(new Date(System.currentTimeMillis()));
            newFeedback.setOrders(orderRepository.findByorderID(feedback.getOrderID()));
            return modelMapper.map(feedbackRepository.save(newFeedback), FeedbackResponse.class);
        }catch (Exception e){
            e.printStackTrace();
            throw new DuplicateException("Error");
        }
    }

    public FeedbackResponse viewFeedbackById(int id){
        Feedback feedback = feedbackRepository.findFeedbackByFeedbackId(id);
        if(feedback == null){
            throw new DuplicateException("Not found this feedback");
        }
        else{
            return modelMapper.map(feedback, FeedbackResponse.class);
        }
    }

    public FeedbackResponse updateFeedback(FeedbackRequest feedback, int Id){
        Feedback oldFeedback = feedbackRepository.findFeedbackByFeedbackId(Id);
        if(oldFeedback == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldFeedback.setRating(feedback.getRating());
            oldFeedback.setDescription(feedback.getDescription());
            return modelMapper.map(feedbackRepository.save(oldFeedback), FeedbackResponse.class);
        }catch (Exception e){
            throw new DuplicateException("Invalid data");
        }
    }


}
