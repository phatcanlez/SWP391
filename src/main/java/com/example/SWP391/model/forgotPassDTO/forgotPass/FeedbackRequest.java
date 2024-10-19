package com.example.SWP391.model.forgotPassDTO.forgotPass;

import lombok.Data;

@Data
public class FeedbackRequest {
   String content;
   int rating;
   long shopId;

}
