package com.example.suwmp_be.entity;

import com.example.suwmp_be.constants.WasteReportStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "waste_reports")
@Getter
@Setter
public class WasteReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ===== Relations ===== */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_id", nullable = false)
    private Enterprise enterprise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waste_type_id", nullable = false)
    private WasteType wasteType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_suggested_type_id", nullable = false)
    private WasteType aiSuggestedType;

    /* ===== Fields ===== */

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column
    private double volume;

    @Pattern(
            regexp = "^(URGENT|NORMAL)$"
    )
    @Column
    private String priority;

    @Column(nullable = false)
    private String photoUrl;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column
    private WasteReportStatus status;

    @Column(name = "enterprise_note")
    private String enterpriseNote;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.priority == null) {
            this.priority = "NORMAL";
        }
        this.createdAt = LocalDateTime.now();
    }
}
