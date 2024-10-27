package com.example.SWP391.repository;

import com.example.SWP391.entity.Feedback;
import com.example.SWP391.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Feedback findFeedbackByFeedbackId(long feedbackId);
    List<Feedback> findFeedbackByOrders(Orders order);
    Page<Feedback> findAll(Pageable pageable);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.rating >= 4")
    long feedbackGreaterThan4();

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.rating < 4")
    long feedbackLessThan4();

    @Query("SELECT AVG(f.rating) FROM Feedback f")
    long feedbackAvarageRating();
}
