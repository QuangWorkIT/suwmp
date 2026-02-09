package com.example.suwmp_be.dto.leaderboard;

import java.util.UUID;

public record PodiumDto(
        int rank,
        UUID userId,
        String name,
        //String area,
        long points,
        int streak
) { }
