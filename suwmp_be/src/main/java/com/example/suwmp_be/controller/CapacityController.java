package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.enterprise_capacity.CreateEnterpriseCapacityRequest;
import com.example.suwmp_be.dto.enterprise_capacity.GetCapacitiesResponse;
import com.example.suwmp_be.dto.enterprise_capacity.UpdateEnterpriseCapacityRequest;
import com.example.suwmp_be.serviceImpl.EnterpriseCapacityServiceImpl;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprises")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CapacityController {
    EnterpriseCapacityServiceImpl enterpriseCapacityService;

    @PostMapping("/capacities")
    public ResponseEntity<BaseResponse<?>> createCapacity(@Valid @RequestBody CreateEnterpriseCapacityRequest request) {
        enterpriseCapacityService.createEnterpriseCapacity(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse<>(
                true,
                "Create capacity for enterprise successful")
        );
    }

    @PutMapping("/capacities/{id}")
    public ResponseEntity<BaseResponse<?>> updateCapacity(@PathVariable long id, @Valid @RequestBody UpdateEnterpriseCapacityRequest body) {
        enterpriseCapacityService.updateEnterpriseCapacity(id, body);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Update capacity for enterprise successful")
        );
    }

    @GetMapping("/{enterpriseId}/capacities")
    public ResponseEntity<BaseResponse<List<GetCapacitiesResponse>>> getCapacitiesByEnterpriseId(@PathVariable long enterpriseId) {
        var response = enterpriseCapacityService.getCapacities(enterpriseId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Get capacities corresponding enterprise successful",
                response)
        );
    }

    @DeleteMapping("/capacities/{id}")
    public ResponseEntity<?> deleteCapacity(@PathVariable long id) {
        enterpriseCapacityService.deleteCapacity(id);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Delete capacity successful")
        );
    }
}
