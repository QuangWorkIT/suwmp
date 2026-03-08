package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.CreateCollectionLogRequest;
import com.example.suwmp_be.dto.view.ICollectionLogHistoryView;
import com.example.suwmp_be.entity.CollectionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ICollectionLogService {
    long createCollectionLog(CreateCollectionLogRequest log);

    Page<ICollectionLogHistoryView> findCollectionLogHistoryByCollector(Pageable pageable, UUID collectorId);
}
