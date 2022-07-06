package com.etf.ppis.Exceptions;

public class ErrorDetails {
    private String error;

    private String message;

    public ErrorDetails(String error,String message) {
        this.error = error;
        this.message = message;
    }

    public ErrorDetails() {
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
