package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.dto.mapper.IRewardRuleMapper;
import com.example.suwmp_be.dto.reward_rule.AddNewRewardRuleRequest;
import com.example.suwmp_be.dto.reward_rule.GetRewardRuleByEnterpriseAndWasteTypeResponse;
import com.example.suwmp_be.exception.BadRequestException;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.EnterpriseCapacityRepository;
import com.example.suwmp_be.repository.RewardRuleRepository;
import com.example.suwmp_be.service.IRewardRuleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RewardRuleServiceImpl implements IRewardRuleService {
    RewardRuleRepository rewardRuleRepository;

    EnterpriseCapacityRepository enterpriseCapacityRepository;

    IRewardRuleMapper rewardRuleMapper;

    @Override
    public void addNewRewardRule(AddNewRewardRuleRequest request) {
        var isExistedCapacity = enterpriseCapacityRepository.existsByEnterpriseIdAndWasteTypeId(request.enterpriseId(), request.wasteTypeId());
        if (!isExistedCapacity) throw new BadRequestException(ErrorCode.CAPACITY_NOT_EXISTED);

        var isDuplicatedRewardRule = rewardRuleRepository.existsByEnterpriseIdAndWasteTypeId(request.enterpriseId(), request.wasteTypeId());
        if (isDuplicatedRewardRule) throw new BadRequestException(ErrorCode.DUPLICATED_DATA);

        var rewardRule = rewardRuleMapper.toRewardRule(request);

        rewardRuleRepository.save(rewardRule);
        log.info("Add successfully new reward rule for enterprise: {}", request.enterpriseId());
    }

    @Override
    public GetRewardRuleByEnterpriseAndWasteTypeResponse getRewardRuleByWasteTypeAndEnterprise(long enterpriseId, long wasteTypeId) {
        var rewardRule = rewardRuleRepository.findByEnterpriseIdAndWasteTypeId(enterpriseId, wasteTypeId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_DATA));
        log.info("Get successfully reward rule of enterprise {} and waste type {}", enterpriseId, wasteTypeId);
        return rewardRuleMapper.toGetRewardRuleByEnterpriseAndWasteTypeResponse(rewardRule);
    }
}
