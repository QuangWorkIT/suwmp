package com.example.suwmp_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "report_collection_status_logs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CollectionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waste_report_id")
    private WasteReport wasteReport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_assignment_id")
    private CollectionAssignment collectionAssignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User collector;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}