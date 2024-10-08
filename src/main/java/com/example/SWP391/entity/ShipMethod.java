package com.example.SWP391.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
public class ShipMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long shipMethodId;

    @NotBlank(message = "Type of ship is required")
    String description;

    @OneToMany(mappedBy = "shipMethod",cascade = CascadeType.ALL)
    @JsonIgnore
    List<OrderDetail> orders = new ArrayList<>();

    @OneToMany(mappedBy = "shipMethod",cascade = CascadeType.ALL)
    @JsonIgnore
    List<PriceListDistance> priceListDistances = new ArrayList<>();

    @OneToMany(mappedBy = "shipMethod",cascade = CascadeType.ALL)
    @JsonIgnore
    List<PriceListWeight> priceListWeights = new ArrayList<>();
}
