package com.example.SWP391.exception;

public class AuthenticateException extends RuntimeException{
    public AuthenticateException(String mess)
    {
        super(mess);
    }
}
