package com.example.suwmp_be.repository.projection;

import com.example.suwmp_be.entity.User;

public interface CitizenPointSum {

    User getCitizen();

    Long getTotalPoints();
}
