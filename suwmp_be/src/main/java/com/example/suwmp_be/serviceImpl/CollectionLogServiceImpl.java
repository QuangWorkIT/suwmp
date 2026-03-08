package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.mapper.ICollectionLog;
import com.example.suwmp_be.dto.request.CreateCollectionLogRequest;
import com.example.suwmp_be.entity.CollectionLog;
import com.example.suwmp_be.repository.CollectionLogRepository;
import com.example.suwmp_be.service.ICollectionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CollectionLogServiceImpl implements ICollectionLogService {
    private final CollectionLogRepository logRepository;
    private final ICollectionLog logMapper;

    @Override
    public long createCollectionLog(CreateCollectionLogRequest logRequest) {
        CollectionLog log = logMapper.toEntity(logRequest);
        return logRepository.save(log).getId();
    }
}
