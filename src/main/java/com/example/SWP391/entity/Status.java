package com.example.SWP391.entity;

import com.example.SWP391.model.Enum.StatusInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
    long id;

    @NotBlank(message = "Status name is required")
    @Column(name = "status_name", nullable = false)
    String description;

    Date date;

    String empId;

    @Enumerated(EnumType.STRING)
    StatusInfo statusInfo;

    String employId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    Orders orders;
}
