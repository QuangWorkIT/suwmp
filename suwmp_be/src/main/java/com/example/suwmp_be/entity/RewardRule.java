package com.example.suwmp_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reward_rules")
public class RewardRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_id", nullable = false)
    @JsonIgnore
    private Enterprise enterprise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waste_type_id", nullable = false)
    @JsonIgnore
    private WasteType wasteType;

    @Column(nullable = false)
    private int basePoints;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal qualityMultiplier;

    @Column
    private int timeBonus;

    @Column(nullable = false)
    private boolean active;

    @PrePersist
    protected void onCreate() { this.active = true; }
}
