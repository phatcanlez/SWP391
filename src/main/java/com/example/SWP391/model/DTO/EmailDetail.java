package com.example.SWP391.model.DTO;

import com.example.SWP391.entity.Account;
import lombok.Data;

@Data
public class EmailDetail {
    Account receiver;
    String subject;
    String link;
    String content;
    String button;

}
