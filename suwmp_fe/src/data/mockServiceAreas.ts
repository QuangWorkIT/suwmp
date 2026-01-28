import type { ServiceArea } from "@/types/serviceArea";

// Flip this to false to use real BE endpoints.
export const USE_MOCK_DATA = true;

export const mockServiceAreas: ServiceArea[] = [
  {
    id: 101,
    enterpriseId: 1,
    latitude: 10.775658,
    longitude: 106.700424,
    radius: 1500,
  },
  {
    id: 102,
    enterpriseId: 1,
    latitude: 10.762622,
    longitude: 106.660172,
    radius: 2200,
  },
  {
    id: 103,
    enterpriseId: 1,
    latitude: 10.817494,
    longitude: 106.671068,
    radius: 1800,
  },
  {
    id: 104,
    enterpriseId: 1,
    latitude: 10.843106,
    longitude: 106.624489,
    radius: 1200,
  },
];

