package com.example.SWP391.model.DTO.chatDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
    int roomID;
    String message;
}
