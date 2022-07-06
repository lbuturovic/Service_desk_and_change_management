package com.etf.ppis.Exceptions;

import org.hibernate.PersistentObjectException;
import org.hibernate.PropertyValueException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.ArrayList;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiError.class)
    public ResponseEntity<?> handleBadRequestException(ApiError apiError){
        ErrorDetails errorDetails = new ErrorDetails(apiError.getError(),apiError.getMessage());
        return new ResponseEntity(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PropertyValueException.class)
    public ResponseEntity<?> handlePropertyValueException(PropertyValueException apiError){
        ErrorDetails errorDetails = new ErrorDetails("Missing property",apiError.getPropertyName()+" is missing");
        return new ResponseEntity(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PersistentObjectException.class)
    public ResponseEntity<?> handlePersistentObjectException(PersistentObjectException apiError){
        ErrorDetails errorDetails = new ErrorDetails("Persistent Object Exception",apiError.getMessage());
        return new ResponseEntity(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<?> handleNullPointerException(NullPointerException apiError){
        ErrorDetails errorDetails = new ErrorDetails("Null Pointer Exception",apiError.getMessage());
        return new ResponseEntity(errorDetails, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException apiError){
        String messages ="";
        ArrayList<String> errors = new ArrayList<>();
        apiError.getAllErrors().forEach((error) -> {
            String message = error.getDefaultMessage();
            errors.add(message);

        });
        for (String msg: errors){
            messages=messages+msg + "; ";
        }
        ErrorDetails errorDetails = new ErrorDetails("Validation",messages);
        return new ResponseEntity(errorDetails, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleArgumentTypeMismatchException(MethodArgumentTypeMismatchException apiError){
        ErrorDetails errorDetails = new ErrorDetails("Method Argument Type Mismatch Exception",apiError.getMessage());
        return new ResponseEntity(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleNotFoundException(NotFoundException apiError){
        ErrorDetails errorDetails = new ErrorDetails("Not found",apiError.getMessage());
        return new ResponseEntity(errorDetails, HttpStatus.NOT_FOUND);
    }
    //java.lang.NumberFormatException
}
