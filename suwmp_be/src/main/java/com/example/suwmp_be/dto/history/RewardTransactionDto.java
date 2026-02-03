package com.example.suwmp_be.dto.history;

import com.example.suwmp_be.entity.RewardTransaction;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RewardTransactionDto {
    private Long id;
    private Integer points;
    private String reason;
    private String wasteType;
    private LocalDateTime createdAt;

    public static RewardTransactionDto from(RewardTransaction rt) {
        return new RewardTransactionDto(
                rt.getId(),
                rt.getPoints(),
                rt.getReason(),
                rt.getWasteReport().getWasteType().getName(),
                rt.getCreatedAt()
        );
    }
}
