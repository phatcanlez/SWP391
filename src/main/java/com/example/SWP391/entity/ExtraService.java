package com.example.SWP391.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ExtraService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long extraServiceId;

    @NotBlank(message = "Service name is required")
    String nameService;

    @Size(min = 0,message = "Price must positive number")
    float price;

    @OneToMany(mappedBy = "extraService",cascade = CascadeType.ALL)
    @JsonIgnore
    List<OrderDetail> orderDetail = new ArrayList<>();
}
