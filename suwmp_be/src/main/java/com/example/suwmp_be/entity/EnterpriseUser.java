package com.example.suwmp_be.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "enterprise_users",
        uniqueConstraints = @UniqueConstraint(columnNames = {"enterprise_id", "user_id"}))
public class EnterpriseUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "enterprise_id", nullable = false)
    private Long enterpriseId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;
}

