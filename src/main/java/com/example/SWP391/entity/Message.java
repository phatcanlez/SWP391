package com.example.SWP391.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int messageID;

    String message;

    Date createAt = new Date();

    @ManyToOne
    @JoinColumn(name = "user_id")
    Account user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "room_id")
    Room room;

}