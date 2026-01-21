package com.example.suwmp_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "\"Token\"")
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @Column(nullable = false)
    private String tokenId;

    @Column(nullable = false)
    private LocalDateTime expiredAt;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
