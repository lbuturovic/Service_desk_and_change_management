package com.etf.ppis.Model.Users;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String taggs;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "created_id")
    private User created;

    public Article() {

    }

    public Article(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public Article(String title, String description, String taggs) {
        this.title = title;
        this.description = description;
        this.taggs = taggs;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTaggs() {
        return taggs;
    }

    public void setTaggs(String taggs) {
        this.taggs = taggs;
    }

    public User getCreated() {
        return created;
    }

    public void setCreated(User created) {
        this.created = created;
    }
}
