package com.example.SWP391.entity;

import jakarta.persistence.*;
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
public class BoxPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long boxId;

    @Size(min = 0,message = "Price must positive number")
    float price;

    @Size(min = 0,message = "Surcharge must positive number")
    float surcharge;

    @OneToMany(mappedBy = "boxPrice",cascade = CascadeType.ALL)
    List<OrderDetail> orderDetail = new ArrayList<>();

}
