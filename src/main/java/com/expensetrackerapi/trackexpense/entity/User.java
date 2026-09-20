package com.expensetrackerapi.trackexpense.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class User {

    public enum Role {
        USER,
        ADMIN
    }
    @Id
    @GeneratedValue
    Long id;

    @Column(unique = true, nullable = false)
    String email;

    @Column(nullable = false)
    String passwordHash;

    @Enumerated(EnumType.STRING)
    private Role role;
}
