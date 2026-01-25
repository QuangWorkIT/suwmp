package com.example.suwmp_be.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "enterprises")
@Data
public class Enterprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private Float rating;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
