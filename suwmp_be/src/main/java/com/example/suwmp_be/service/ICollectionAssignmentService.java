package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.AssignCollectorRequest;

public interface ICollectionAssignmentService {
    Long assignCollector(AssignCollectorRequest dto);
}
