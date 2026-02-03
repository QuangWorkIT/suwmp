package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.request.WasteReportRequest;
import com.example.suwmp_be.dto.response.EnterpriseNearbyResponse;
import com.example.suwmp_be.dto.view.ICollectionRequestView;
import com.example.suwmp_be.dto.view.IEnterpriseDistanceView;

import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IWasteReportService {
    long createNewReport(WasteReportRequest wasteReport);

    List<ICollectionRequestView> getWasteReportRequestsByEnterprise(Long enterpriseId);

    List<EnterpriseNearbyResponse> getEnterprisesNearbyCitizen(Double citizenLong, Double citizenLat, Long wasteTypeId);
}
