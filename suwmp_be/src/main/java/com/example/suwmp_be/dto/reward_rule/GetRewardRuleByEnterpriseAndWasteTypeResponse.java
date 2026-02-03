package com.example.suwmp_be.dto.reward_rule;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GetRewardRuleByEnterpriseAndWasteTypeResponse {
    long id;

    int basePoints;

    BigDecimal qualityMultiplier;

    int timeBonus;

    boolean active;
}
