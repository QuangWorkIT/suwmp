package com.example.suwmp_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "collection_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ===== Relations ===== */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waste_report_id", nullable = false)
    private WasteReport wasteReport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_id", nullable = false)
    private Enterprise enterprise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collector_id")
    private User collector;

    /* ===== Time Fields ===== */

    @Column(name = "assigned_at")
    private OffsetDateTime assignedAt;

    @Column(name = "start_collect_at")
    private OffsetDateTime startCollectAt;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "last_updated_at")
    private OffsetDateTime lastUpdatedAt;

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.lastUpdatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdatedAt = OffsetDateTime.now();
    }
}
