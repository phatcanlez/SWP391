package com.example.SWP391.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
    long id;

    Date dateOfIssue;

    @NotBlank(message = "License name is required")
    String nameOfLicense;

    @NotBlank(message = "License type is required")
    String typeOfLicense;

    @Size(min = 0, max = 200, message = "Description must be between 0 and 200 characters")
    String description;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    Orders orders;
}
