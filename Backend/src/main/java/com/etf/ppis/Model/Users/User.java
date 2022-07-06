package com.etf.ppis.Model.Users;

import com.etf.ppis.Model.Request.Response;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@SequenceGenerator(name = "User_Id_Seq_Gen", sequenceName = "USER_ID_SEQ_GEN", initialValue = 1)
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "User_Id_Seq_Gen")
    private Long id;

    @Column(unique=true)
    @NotBlank(message = "Username cannot be null")
    @Size(min=3, max=20, message = "Username must have at lest 3 characters")
    private String username;

    @NotBlank (message = "Password cannot be null")
    @Size(min=5, max=120, message = "Password must have at least 5 characters")
    private String password;

    @NotBlank (message = "First name cannot be null")
    @Size(min=2, max=30, message = "First name must be between 2 and 30 characters long")
    private String firstName;

    @NotBlank (message = "Last name cannot be null")
    @Size(min=2, max=30, message = "Last name must be between 2 and 30 characters long")
    private String lastName;

    @Column(unique=true)
    @NotBlank (message = "Email cannot be null")
    @Email(message = "Email should be valid")
    private String email;

    private Boolean active;

    @ManyToMany(fetch = FetchType.LAZY)
    @NotNull
    @JoinTable(	name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    private LocalDateTime timestamp;
    @UpdateTimestamp
    private LocalDateTime updateTimestamp;

    //@OneToMany(mappedBy = "id")
    //private List<Article> articles = new ArrayList<>();

    public User(String username, String password, String firstName, String lastName, String email) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.active = true;
    }

    public User() {

    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LocalDateTime getUpdateTimestamp() {
        return updateTimestamp;
    }

    public void setUpdateTimestamp(LocalDateTime updateTimestamp) {
        this.updateTimestamp = updateTimestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    /*public List<Article> getArticles() {
        return articles;
    }

    public void setArticles(List<Article> articles) {
        this.articles = articles;
    }*/
}
