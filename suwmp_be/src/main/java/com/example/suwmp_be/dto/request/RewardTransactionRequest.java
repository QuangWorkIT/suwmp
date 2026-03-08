package com.example.suwmp_be.dto.request;

import com.example.suwmp_be.entity.RewardTransaction;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.entity.WasteReport;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class RewardTransactionRequest {
    @NotNull(message = "Citizen ID cannot be null")
    private UUID citizenId;

    @NotNull(message = "Waste Report ID cannot be null")
    private Long wasteReportId;

    @NotNull(message = "Points cannot be null")
    private Integer points;

    private String reason;

    public static RewardTransaction toEntity(User citizen, WasteReport wasteReport, Integer points, String reason) {
        RewardTransaction transaction = new RewardTransaction();
        transaction.setCitizen(citizen);
        transaction.setWasteReport(wasteReport);
        transaction.setPoints(points);
        transaction.setReason(reason);
        return transaction;
    }
}
