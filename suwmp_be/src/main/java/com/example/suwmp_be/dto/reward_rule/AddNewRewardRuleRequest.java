package com.example.suwmp_be.dto.reward_rule;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record AddNewRewardRuleRequest(
        @Positive
        long enterpriseId,

        @Positive
        long wasteTypeId,

        @Positive
        int basePoints,

        @Positive
        BigDecimal qualityMultiplier,

        @Positive
        int timeBonus) {
}
