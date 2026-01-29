package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.request.CreateServiceAreaRequest;
import com.example.suwmp_be.dto.response.ServiceAreaResponse;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.ServiceArea;
import com.example.suwmp_be.exception.ResourceNotFoundException;
import com.example.suwmp_be.repository.EnterpriseRepository;
import com.example.suwmp_be.repository.ServiceAreaRepository;
import com.example.suwmp_be.service.ServiceAreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceAreaServiceImpl implements ServiceAreaService {

    private final ServiceAreaRepository serviceAreaRepository;
    private final EnterpriseRepository enterpriseRepository;

    @Override
    public ServiceAreaResponse create(Long enterpriseId, CreateServiceAreaRequest request) {
        Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                .orElseThrow(() -> new ResourceNotFoundException("Enterprise", "id", enterpriseId));

        ServiceArea area = new ServiceArea();
        area.setEnterprise(enterprise);
        area.setLatitude(request.getLatitude());
        area.setLongitude(request.getLongitude());
        area.setRadius(request.getRadius());

        ServiceArea saved = serviceAreaRepository.save(area);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceAreaResponse> list(Long enterpriseId) {
        return serviceAreaRepository.findByEnterpriseId(enterpriseId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ServiceAreaResponse toResponse(ServiceArea area) {
        return ServiceAreaResponse.builder()
                .id(area.getId())
                .enterpriseId(area.getEnterprise().getId())
                .latitude(area.getLatitude())
                .longitude(area.getLongitude())
                .radius(area.getRadius())
                .build();
    }
}

