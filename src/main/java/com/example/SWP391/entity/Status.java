package com.example.SWP391.entity;

import com.example.SWP391.model.StatusInfo;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @NotBlank(message = "Status name is required")
    StatusInfo description;

    Date date;
    Employee employee;

    @Enumerated(EnumType.STRING)
    StatusInfo statusInfo;
}
