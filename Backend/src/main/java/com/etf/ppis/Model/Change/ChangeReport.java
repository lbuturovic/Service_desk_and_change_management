package com.etf.ppis.Model.Change;

import com.etf.ppis.Model.Users.User;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@SequenceGenerator(name = "Report_Id_Seq_Gen", sequenceName = "REPORT_ID_SEQ_GEN", initialValue = 1)
public class ChangeReport {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "Report_Id_Seq_Gen")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "change_id")
    private Change change;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "employee_id")
    private User employee;

    @Enumerated(EnumType.STRING)
    @Column(name="change_status")
    private ChangeStatus status;

    @NotNull(message = "Description is mandatory!")
    private String description;

    private LocalDate start;

    private LocalDate end;

    @CreationTimestamp
    private LocalDateTime created;

    public ChangeReport(Change change, String description, LocalDate start, LocalDate end) {
        this.change = change;
        this.employee = change.getExecutor();
        this.status = change.getStatus();
        this.description = description;
        this.start = start;
        this.end = end;
    }

    public ChangeReport() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Change getChange() {
        return change;
    }

    public void setChange(Change change) {
        this.change = change;
    }

    public User getEmployee() {
        return employee;
    }

    public void setEmployee(User employee) {
        this.employee = employee;
    }

    public ChangeStatus getStatus() {
        return status;
    }

    public void setStatus(ChangeStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStart() {
        return start;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return end;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }
}
