package com.example.suwmp_be.dto.leaderboard;

import java.util.UUID;

public record RankingDto(
        int rank,
        UUID userId,
        String name,
        //String area,
        long points,
        int streak,
        boolean isMe
) { }
