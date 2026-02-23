export interface RewardRule {
  id: number;
  enterpriseId: number;
  wasteTypeId: number;
  basePoints: number;
  qualityMultiplier: number;
  active: boolean;
}

export interface CreateRewardRuleRequest {
  enterpriseId: number;
  wasteTypeId: number;
  basePoints: number;
  qualityMultiplier: number;
}

export interface UpdateRewardRuleRequest {
  basePoints: number;
  qualityMultiplier: number;
  active: boolean;
}
