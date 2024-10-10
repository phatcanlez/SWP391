package com.example.SWP391.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ExceptionHandlerClass {
    Map<String, String> error;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleValidation(MethodArgumentNotValidException ex){
        error = new HashMap<>();
        String mess ="";
        for(FieldError fieldError : ex.getBindingResult().getFieldErrors()){
            mess += fieldError.getDefaultMessage() + ", ";
            error.put("Error",mess);
        }
        return new ResponseEntity(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity duplicate(Exception ex) {
        error = new HashMap<>();
        error.put("Error", ex.getMessage());
        return new ResponseEntity(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity notFound(Exception ex) {
        error = new HashMap<>();
        error.put("Error", ex.getMessage());
        return new ResponseEntity(error, HttpStatus.BAD_REQUEST);
    }
}
