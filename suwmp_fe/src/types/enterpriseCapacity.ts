export type CapacityStatus = "NORMAL" | "WARNING" | "CRITICAL";

export interface WasteType {
  id: number;
  name: string;
}

export interface Enterprise {
  id: number;
  name: string;
}

export interface EnterpriseCapacity {
  id: number;
  wasteTypeId: number;
  wasteTypeName: string;
  enterpriseId: number;
  dailyCapacityKg: number;
  warningThreshold: number;
  active: boolean;
  usedKg: number;
}

export interface UpdateEnterpriseCapacityRequest {
  dailyCapacityKg: number;
  warningThreshold: number;
  active: boolean;
}

export interface CreateEnterpriseCapacityRequest {
  enterpriseId: number | null;
  wasteTypeId: number;
  dailyCapacityKg: number;
  warningThreshold: number;
}
