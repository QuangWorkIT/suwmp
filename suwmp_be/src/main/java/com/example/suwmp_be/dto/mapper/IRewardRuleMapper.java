package com.example.suwmp_be.dto.mapper;

import com.example.suwmp_be.dto.reward_rule.AddNewRewardRuleRequest;
import com.example.suwmp_be.dto.reward_rule.GetRewardRuleByEnterpriseAndWasteTypeResponse;
import com.example.suwmp_be.entity.RewardRule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IRewardRuleMapper {
    @Mapping(source = "enterpriseId", target = "enterprise.id")
    @Mapping(source = "wasteTypeId", target = "wasteType.id")
    RewardRule toRewardRule(AddNewRewardRuleRequest request);

    GetRewardRuleByEnterpriseAndWasteTypeResponse toGetRewardRuleByEnterpriseAndWasteTypeResponse(RewardRule rewardRule);
}
