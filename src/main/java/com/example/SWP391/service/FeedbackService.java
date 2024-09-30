package com.example.SWP391.service;

import com.example.SWP391.entity.Feedback;
import com.example.SWP391.entity.License;
import com.example.SWP391.exception.DuplicateException;
import com.example.SWP391.exception.NotFoundException;
import com.example.SWP391.repository.FeedbackRepository;
import com.example.SWP391.repository.LicenseRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<Feedback> getAllFeedbacks(){
        List<Feedback> list = feedbackRepository.findAll();
        return list;
    }

    public Feedback createFeedback(Feedback feedback){
        try{
            Feedback newFeedback = feedbackRepository.save(feedback);
            return newFeedback;
        }catch (Exception e){
            e.printStackTrace();
            throw new DuplicateException("Error");
        }
    }

    public Feedback viewFeedbackById(int id){
        Feedback feedback = feedbackRepository.findFeedbackByFeedbackId(id);
        if(feedback == null){
            throw new DuplicateException("Not found this feedback");
        }
        else{
            return feedback;
        }
    }

    public Feedback updateFeedback(Feedback feedback, int Id){
        Feedback oldFeedback = feedbackRepository.findFeedbackByFeedbackId(Id);
        if(oldFeedback == null){
            throw new NotFoundException("Not found!");
        }
        try{
            oldFeedback.setFeedbackDate(feedback.getFeedbackDate());
            oldFeedback.setRating(feedback.getRating());
            oldFeedback.setDescription(feedback.getDescription());
            return feedbackRepository.save(oldFeedback);
        }catch (Exception e){
            throw new DuplicateException("Invalid data");
        }
    }


}
