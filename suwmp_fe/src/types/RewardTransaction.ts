export interface RewardTransaction {
  id: number;
  points: number;
  reason: string;
  createdAt: string;

  wasteType: string;
  longitude: number;
  latitude: number;
  volume: number | null;
  status: string;
}

export type CreateRewardTransactionRequest = {
    citizenId: string;
    wasteReportId: number;
    points: number;
    reason: string;
}