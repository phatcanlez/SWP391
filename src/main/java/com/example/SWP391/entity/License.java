package com.example.SWP391.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
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
public class License {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int licenseId;

    Date issueDate;

    @NotBlank(message = "License name is required")
    String licenseName;

    @NotBlank(message = "License type is required")
    String licenseType;

    @Size(min = 0, max = 200, message = "Description must be between 0 and 200 characters")
    String description;

//    Order order;
}
