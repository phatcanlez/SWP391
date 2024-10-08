package com.example.SWP391.repository;

import com.example.SWP391.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Feedback findFeedbackByFeedbackId(long feedbackId);
}
