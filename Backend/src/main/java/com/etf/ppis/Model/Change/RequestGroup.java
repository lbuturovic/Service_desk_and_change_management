package com.etf.ppis.Model.Change;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@SequenceGenerator(name = "Group_Id_Seq_Gen", sequenceName = "GROUP_ID_SEQ_GEN", initialValue = 1)
public class RequestGroup {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "Group_Id_Seq_Gen")
    private Long id;

    @NotNull(message = "Description is mandatory!")
    private String description;

    public RequestGroup() {
    }

    public RequestGroup(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }
}
