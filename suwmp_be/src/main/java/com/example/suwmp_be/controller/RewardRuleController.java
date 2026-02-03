package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.reward_rule.AddNewRewardRuleRequest;
import com.example.suwmp_be.dto.reward_rule.GetRewardRuleByEnterpriseAndWasteTypeResponse;
import com.example.suwmp_be.serviceImpl.RewardRuleServiceImpl;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enterprises")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RewardRuleController {
    RewardRuleServiceImpl rewardRuleService;

    @PostMapping("/reward-rules")
    public ResponseEntity<BaseResponse<?>> addNewRewardRule(@Valid @RequestBody AddNewRewardRuleRequest request) {
        rewardRuleService.addNewRewardRule(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse<>(
                true,
                "Add new reward rule successful")
        );
    }

    @GetMapping("/{enterpriseId}/waste-types/{wasteTypeId}/reward-rules")
    public ResponseEntity<BaseResponse<GetRewardRuleByEnterpriseAndWasteTypeResponse>> getRewardRuleByEnterpriseAndWasteTypeResponse(@PathVariable long enterpriseId, @PathVariable int wasteTypeId) {
        var dto = rewardRuleService.getRewardRuleByWasteTypeAndEnterprise(enterpriseId, wasteTypeId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(
                true,
                "Get reward rule successful",
                dto)
        );
    }
}
