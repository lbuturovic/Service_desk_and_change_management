package com.etf.ppis.Model.Request;

import com.etf.ppis.Model.Users.User;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
public class Response {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String description;
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name="sender_id")
    private User sender;
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name="receiver_id")
    private User receiver;
    private LocalDateTime created;
    @Enumerated(EnumType.STRING)
    private ResponseStatus status;
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name="request_id")
    private Request request;

    public Response() {
    }

    public Response(String description) {
        this.description = description;
        this.created = LocalDateTime.now();
        this.status = ResponseStatus.NN;
    }

    public Response(String description, ResponseStatus status) {
        this.description = description;
        this.created = LocalDateTime.now();
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public ResponseStatus getStatus() {
        return status;
    }

    public void setStatus(ResponseStatus status) {
        this.status = status;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
