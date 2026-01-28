package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.request.CreateWasteTypeRequest;
import com.example.suwmp_be.dto.response.WasteTypeResponse;
import com.example.suwmp_be.serviceImpl.WasteTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/waste-types")
@RequiredArgsConstructor
public class WasteTypeController {

    private final WasteTypeService service;

    @PostMapping
    public ResponseEntity<WasteTypeResponse> create(
            @Valid @RequestBody CreateWasteTypeRequest request
    ) {
        return ResponseEntity.ok(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<WasteTypeResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
