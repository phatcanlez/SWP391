package com.example.SWP391.repository;

import com.example.SWP391.entity.Feedback;
import com.example.SWP391.entity.License;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    Feedback findFeedbackByFeedbackId(int feedbackId);
}
