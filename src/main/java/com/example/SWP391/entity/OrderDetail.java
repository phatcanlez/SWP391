package com.example.SWP391.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String ordDetailId;

    @Min(value = 0, message = "box must be positive number")
    int smallBox;

    @Min(value = 0, message = "box must be positive number")
    int mediumBox;

    @Min(value = 0, message = "box must be positive number")
    int largeBox;

    @Min(value = 0, message = "box must be positive number")
    int extraLargeBox;

    @Min(value = 0, message = "kilometer must be positive number")
    float kilometer;

    @ManyToOne
    @JoinColumn(name = "ship_method_id")
    @JsonIgnore
    ShipMethod shipMethod;

    @ManyToOne
    @JoinColumn(name = "box_id")
    @JsonIgnore
    BoxPrice boxPrice;

    @ManyToOne
    @JoinColumn(name = "extra_service_id")
    @JsonIgnore
    ExtraService extraService;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ord_id", referencedColumnName = "orderID", unique = true)
    @JsonIgnore
    Orders orders;

}
