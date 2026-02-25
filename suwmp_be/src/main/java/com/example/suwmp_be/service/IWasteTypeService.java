package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.CreateWasteTypeRequest;
import com.example.suwmp_be.dto.response.WasteTypeResponse;

import java.util.List;

public interface IWasteTypeService {

    WasteTypeResponse create(CreateWasteTypeRequest req);

    List<WasteTypeResponse> getAll();

    void delete(Integer id);
}
