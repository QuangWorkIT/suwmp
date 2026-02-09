package com.example.suwmp_be.dto.leaderboard;

public record MyLeaderBoardDto(
        int rank,
        long points,
        int streak
) { }
