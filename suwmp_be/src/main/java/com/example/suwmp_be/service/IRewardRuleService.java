package com.example.suwmp_be.service;

import com.example.suwmp_be.dto.reward_rule.AddNewRewardRuleRequest;
import com.example.suwmp_be.dto.reward_rule.GetRewardRuleByEnterpriseAndWasteTypeResponse;

public interface IRewardRuleService {
    void addNewRewardRule(AddNewRewardRuleRequest request);

    GetRewardRuleByEnterpriseAndWasteTypeResponse getRewardRuleByWasteTypeAndEnterprise(long enterpriseId, long wasteTypeId);
}
