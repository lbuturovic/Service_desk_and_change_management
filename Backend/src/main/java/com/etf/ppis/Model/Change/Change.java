package com.etf.ppis.Model.Change;

import com.etf.ppis.Model.Users.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "changes")
@SequenceGenerator(name = "Change_Id_Seq_Gen", sequenceName = "CHANGE_ID_SEQ_GEN", initialValue = 1)
public class Change {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "Change_Id_Seq_Gen")
    private Long id;

    @Column(name = "subject", nullable = false, length = 60)
    @NotNull(message = "Subject is mandatory!")
    private String subject;

    @Column(name = "description", nullable = false, length = 450)
    @NotNull(message = "Description is mandatory!")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "group_id")
    private RequestGroup group;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "executor_id")
    private User executor;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "approver_id")
    private User approver;

    @Enumerated(EnumType.STRING)
    @Column(name="change_status")
    private ChangeStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name="change_priority")
    private ChangePriority priority;

    @Enumerated(EnumType.STRING)
    @Column(name="change_category")
    private ChangeCategory category;

    @CreationTimestamp
    private LocalDateTime created;

    @UpdateTimestamp
    private LocalDateTime updated;

    public Change() {
    }

    public Change(String subject, String description, RequestGroup group, User reporter, User executor, User approver, ChangeStatus status, ChangePriority priority, ChangeCategory category) {
        this.subject = subject;
        this.description = description;
        this.group = group;
        this.reporter = reporter;
        this.executor = executor;
        this.approver = approver;
        this.status = status;
        this.priority = priority;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public RequestGroup getGroup() {
        return group;
    }

    public void setGroup(RequestGroup group) {
        this.group = group;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public User getExecutor() {
        return executor;
    }

    public void setExecutor(User executor) {
        this.executor = executor;
    }

    public User getApprover() {
        return approver;
    }

    public void setApprover(User approver) {
        this.approver = approver;
    }

    public ChangeStatus getStatus() {
        return status;
    }

    public void setStatus(ChangeStatus status) {
        this.status = status;
    }

    public ChangePriority getPriority() {
        return priority;
    }

    public void setPriority(ChangePriority priority) {
        this.priority = priority;
    }

    public ChangeCategory getCategory() {
        return category;
    }

    public void setCategory(ChangeCategory category) {
        this.category = category;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public LocalDateTime getUpdated() {
        return updated;
    }

    public void setUpdated(LocalDateTime updated) {
        this.updated = updated;
    }
}
