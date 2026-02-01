package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.enterprise_capacity.CreateEnterpriseCapacityRequest;
import com.example.suwmp_be.dto.enterprise_capacity.GetCapacitiesResponse;
import com.example.suwmp_be.dto.enterprise_capacity.UpdateEnterpriseCapacityRequest;
import com.example.suwmp_be.dto.mapper.IEnterpriseCapacityMapper;
import com.example.suwmp_be.exception.BadRequestException;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.EnterpriseCapacityRepository;
import com.example.suwmp_be.service.IEnterpriseCapacityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnterpriseCapacityServiceImpl implements IEnterpriseCapacityService {
    private final EnterpriseCapacityRepository enterpriseCapacityRepository;
    private final IEnterpriseCapacityMapper enterpriseCapacityMapper;

    @Override
    @Transactional
    public void createEnterpriseCapacity(CreateEnterpriseCapacityRequest request) {
        var isExisted = enterpriseCapacityRepository.existsByEnterpriseIdAndWasteTypeId(request.enterpriseId(), request.wasteTypeId());
        if (isExisted) throw new BadRequestException(ErrorCode.DUPLICATED_DATA);

        var enterpriseCapacity = enterpriseCapacityMapper.toEnterpriseCapacity(request);
        enterpriseCapacityRepository.save(enterpriseCapacity);
        log.info("Create new enterprise capacity successful: CapacityId {}", enterpriseCapacity.getId());
    }

    @Override
    @Transactional
    public void updateEnterpriseCapacity(long id, UpdateEnterpriseCapacityRequest request) {
        var capacity = enterpriseCapacityRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_DATA));
        enterpriseCapacityMapper.toEnterpriseCapacity(capacity, request);
        enterpriseCapacityRepository.save(capacity);
        log.info("Update successful capacity: {}", id);
    }

    @Override
    public List<GetCapacitiesResponse> getCapacities(long enterpriseId) {
        var capacities = enterpriseCapacityRepository.findByEnterpriseId(enterpriseId);
        log.info("Get capacities successful.");

        return capacities.map(enterpriseCapacities -> enterpriseCapacities
                .stream()
                .map(c -> {
                            var getCapacitiesResponse = enterpriseCapacityMapper.toGetCapacitiesResponse(c);
                            getCapacitiesResponse.setWasteTypeName(c.getWasteType().getName());
                            return getCapacitiesResponse;
                        }
                ).toList()).orElseGet(ArrayList::new);
    }

    @Override
    public void deleteCapacity(long id) {
        enterpriseCapacityRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_DATA));
        enterpriseCapacityRepository.deleteById(id);
        log.info("Delete successful capacity: {}", id);
    }
}
