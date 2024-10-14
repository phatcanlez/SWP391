package com.example.SWP391.entity;

import com.example.SWP391.model.Enum.OrderType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

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

    @Min(value = 0, message = "total weight must be positive number")
    double totalWeight;

    @Min(value = 0, message = "quantity must be positive number")
    int quantity;

    @Enumerated(EnumType.STRING)
    OrderType type;

    @ManyToOne
    @JoinColumn(name = "ship_method_id")
    @JsonIgnore
    ShipMethod shipMethod;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "order_detail_box_price",
            joinColumns = @JoinColumn(name = "ord_detail_id"),
            inverseJoinColumns = @JoinColumn(name = "box_price_id")
    )
    Set<BoxPrice> boxPrice;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "order_detail_extra_service",
            joinColumns = @JoinColumn(name = "ord_detail_id"),
            inverseJoinColumns = @JoinColumn(name = "extra_service_id")
    )
    Set<ExtraService> extraService;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ord_id", referencedColumnName = "orderID", unique = true)
    @JsonIgnore
    Orders orders;

}
