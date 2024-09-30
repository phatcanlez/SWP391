package com.example.SWP391.exception;

public class NotFoundException extends RuntimeException{
    public NotFoundException(String mess)
    {
            super(mess);
    }
}
