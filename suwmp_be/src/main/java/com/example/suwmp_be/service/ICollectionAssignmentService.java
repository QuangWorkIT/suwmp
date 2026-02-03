package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.CreateCollectionAssignment;
import com.example.suwmp_be.entity.CollectionAssignment;

public interface ICollectionAssignmentService {
    Long createACollectionAssignment(CreateCollectionAssignment dto);
}
