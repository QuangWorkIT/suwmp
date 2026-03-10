package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.CreateCollectionLogRequest;
import com.example.suwmp_be.entity.CollectionLog;

public interface ICollectionLogService {
    long createCollectionLog(CreateCollectionLogRequest log);
}
