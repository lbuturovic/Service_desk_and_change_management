package com.etf.ppis.Model.Request;

import com.etf.ppis.Model.Change.RequestGroup;
import com.etf.ppis.Model.Users.User;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Request {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    @NotBlank
    private String subject;
    private String description;
    @ManyToOne
    @JoinColumn(name="reported_id")
    private User reported;
    @ManyToOne
    @JoinColumn(name="resolving_id")
    private User resolving;
    private LocalDateTime created;
    private LocalDateTime firstResponseDue;
    private LocalDate due;
    @NotNull
    @Enumerated(EnumType.STRING)
    private RequestCategory category;
    @NotNull
    @Enumerated(EnumType.STRING)
    private RequestPriority priority;
    @Enumerated(EnumType.STRING)
    private  RequestStatus status;
    @OneToMany(mappedBy = "id")
    private List<Response> responses = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "group_id")
    private RequestGroup group;

    public Request() {
    }

    public Request(String subject, String description, RequestCategory category, RequestPriority priority) {
        this.subject = subject;
        this.description = description;
        this.created = LocalDateTime.now();
        this.priority = priority;
        if(priority == RequestPriority.LOW)this.firstResponseDue = created.plusDays(3);
        if(priority == RequestPriority.MEDIUM)this.firstResponseDue = created.plusDays(2);
        if(priority == RequestPriority.HIGH)this.firstResponseDue = created.plusDays(1);
        if(priority == RequestPriority.URGENT)this.firstResponseDue = created.plusHours(5);
        this.category = category;
        this.status = RequestStatus.OPEN;
        this.group = null;
    }

    public Long getId() {
        return id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getReported() {
        return reported;
    }

    public void setReported(User reported) {
        this.reported = reported;
    }

    public User getResolving() {
        return resolving;
    }

    public void setResolving(User resolving) {
        this.resolving = resolving;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public LocalDateTime getFirstResponseDue() {
        return firstResponseDue;
    }

    public void setFirstResponseDue(LocalDateTime firstResponseDue) {
        this.firstResponseDue = firstResponseDue;
    }

    public LocalDate getDue() {
        return due;
    }

    public void setDue(LocalDate due) {
        this.due = due;
    }

    public RequestCategory getCategory() {
        return category;
    }

    public void setCategory(RequestCategory category) {
        this.category = category;
    }

    public RequestPriority getPriority() {
        return priority;
    }

    public void setPriority(RequestPriority priority) {
        this.priority = priority;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public List<Response> getResponses() {
        return responses;
    }

    public void setResponses(List<Response> responses) {
        this.responses = responses;
    }

    public RequestGroup getGroup() {
        return group;
    }

    public void setGroup(RequestGroup group) {
        this.group = group;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
