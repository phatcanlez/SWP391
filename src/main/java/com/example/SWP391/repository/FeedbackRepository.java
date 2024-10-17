package com.example.SWP391.repository;

import com.example.SWP391.entity.Feedback;
import com.example.SWP391.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Feedback findFeedbackByFeedbackId(long feedbackId);
    List<Feedback> findFeedbackByOrders(Orders order);
}
