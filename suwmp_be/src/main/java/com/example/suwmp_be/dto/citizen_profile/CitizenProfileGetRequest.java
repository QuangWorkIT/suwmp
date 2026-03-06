package com.example.suwmp_be.dto.citizen_profile;

import java.util.UUID;

public record CitizenProfileGetRequest(
        UUID citizenId
) { }
