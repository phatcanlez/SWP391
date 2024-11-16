package com.example.SWP391.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roomID;

    Date lastUpdated = new Date();

    String lastMessage;
    @JsonManagedReference

    @ManyToMany(mappedBy = "rooms",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Account> users;

    @OneToMany(mappedBy = "room")
    private List<Message> messages;
}
