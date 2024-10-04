package com.example.SWP391.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long feedbackId;

    Date feedbackDate;

    @NotNull(message = "Star rating is required")
    int rating;

    @Size(min = 0, max = 200, message = "Feedback must be between 0 and 200 characters")
    String description;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    Orders orders;
}
