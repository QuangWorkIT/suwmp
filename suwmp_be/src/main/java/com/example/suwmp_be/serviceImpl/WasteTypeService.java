package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.request.CreateWasteTypeRequest;
import com.example.suwmp_be.dto.response.WasteTypeResponse;
import com.example.suwmp_be.entity.WasteType;
import com.example.suwmp_be.repository.WasteTypeRepository;
import com.example.suwmp_be.service.IWasteTypeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WasteTypeService implements IWasteTypeService {

    private final WasteTypeRepository repository;

    @Transactional
    @Override
    public WasteTypeResponse create(CreateWasteTypeRequest req) {
        if (repository.existsByNameIgnoreCaseAndDeletedAtIsNull(req.getName())) {
            throw new RuntimeException("Waste type already exists");
        }

        WasteType type = new WasteType();
        type.setName(req.getName());
        type.setDescription(req.getDescription());

        WasteType saved = repository.save(type);

        return new WasteTypeResponse(
                saved.getId(),
                saved.getName(),
                saved.getDescription()
        );
    }

    @Override
    public List<WasteTypeResponse> getAll() {
        return repository.findAllByDeletedAtIsNull()
                .stream()
                .map(t -> new WasteTypeResponse(
                        t.getId(),
                        t.getName(),
                        t.getDescription()
                ))
                .toList();
    }

    @Transactional
    @Override
    public void delete(Integer id) {
        WasteType type = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        type.setDeletedAt(LocalDateTime.now());
        repository.save(type);
    }
}
