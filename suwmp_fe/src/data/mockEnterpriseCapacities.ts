import type {
  EnterpriseCapacity,
  WasteType,
  Enterprise,
} from "@/types/enterpriseCapacity";

/**
 * UI-only mock data for Capacity Management.
 * - `usedKg`, `warningThresholdPct`, `autoPauseAtThreshold` are FE-only for now.
 * - `dailyCapacityKg` can be updated via BE by id.
 */
export const USE_MOCK_CAPACITY_DATA = true;

// Mock WasteTypes (from BE waste_types table)
export const mockWasteTypes: WasteType[] = [
  { id: 1, name: "Recyclables" },
  { id: 2, name: "Organic Waste" },
  { id: 3, name: "E-Waste" },
  { id: 4, name: "Hazardous" },
  { id: 5, name: "Plastic" },
  { id: 6, name: "Paper" },
  { id: 7, name: "Glass" },
  { id: 8, name: "Metal" },
];

// Mock Enterprises (from BE enterprises table)
export const mockEnterprises: Enterprise[] = [
  { id: 1, name: "GreenCycle Inc." },
  { id: 2, name: "EcoWaste Solutions" },
  { id: 3, name: "Sustainable Disposal Co." },
];

export const mockEnterpriseCapacities: EnterpriseCapacity[] = [
  {
    id: 1,
    wasteTypeId: 1,
    wasteTypeName: "Recyclables",
    enterpriseId: 1,
    enterpriseName: "GreenCycle Inc.",
    usedKg: 750,
    dailyCapacityKg: 1000,
    warningThreshold: 90,
    active: true,
  },
  {
    id: 2,
    wasteTypeId: 2,
    wasteTypeName: "Organic Waste",
    enterpriseId: 1,
    enterpriseName: "GreenCycle Inc.",
    usedKg: 480,
    dailyCapacityKg: 800,
    warningThreshold: 85,
    active: true,
  },
  {
    id: 3,
    wasteTypeId: 3,
    wasteTypeName: "E-Waste",
    enterpriseId: 1,
    enterpriseName: "GreenCycle Inc.",
    usedKg: 135,
    dailyCapacityKg: 300,
    warningThreshold: 95,
    active: false,
  },
  {
    id: 4,
    wasteTypeId: 4,
    wasteTypeName: "Hazardous",
    enterpriseId: 1,
    enterpriseName: "GreenCycle Inc.",
    usedKg: 30,
    dailyCapacityKg: 100,
    warningThreshold: 80,
    active: true,
  },
];
