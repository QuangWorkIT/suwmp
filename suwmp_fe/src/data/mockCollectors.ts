import type { Collector } from "@/types/collector";

/**
 * Mock data for collectors
 * TODO: Replace with real API data when backend is ready
 * This file can be deleted once real data is integrated
 */
export const mockCollectors: Collector[] = [
  {
    id: "1",
    fullName: "Alex Chen",
    email: "alex@collector.com",
    phone: "+1 555-0123",
    status: "ACTIVE",
    imageUrl: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    fullName: "Maria Santos",
    email: "maria@collector.com",
    phone: "+1 555-0456",
    status: "IDLE",
    imageUrl: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    fullName: "John Davis",
    email: "john@collector.com",
    phone: "+1 555-0789",
    status: "ACTIVE",
    imageUrl: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    fullName: "Emma Wilson",
    email: "emma@collector.com",
    phone: "+1 555-0321",
    status: "OFFLINE",
    imageUrl: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    fullName: "James Lee",
    email: "james@collector.com",
    phone: "+1 555-0654",
    status: "ACTIVE",
    imageUrl: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    fullName: "Olivia Brown",
    email: "olivia@collector.com",
    phone: "+1 555-0987",
    status: "IDLE",
    imageUrl: null,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Flag to enable/disable mock data
 * Set to false when ready to use real API data
 */
export const USE_MOCK_DATA = true;
