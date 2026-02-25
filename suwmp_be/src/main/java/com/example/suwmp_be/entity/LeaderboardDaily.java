package com.example.suwmp_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "leaderboard_daily")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardDaily {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @Column(nullable = false)
    private Integer rank;

    @Column(name = "total_points", nullable = false)
    private Long totalPoints;

    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;
}
