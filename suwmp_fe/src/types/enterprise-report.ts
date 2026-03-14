export interface ReportWidgetData {
  averageResponseTime: number;
  citizenSatisfactionScore: number;
  totalCollections: number;
  volumeProcessed: number;
}

export interface CollectionTrend {
  date: string;
  totalCollections: number;
}

export interface WasteDistribution {
  wasteType: string;
  totalReports: number;
  percentage: number;
}

export interface CollectorPerformance {
  collectorName: string;
  zone: string;
  collections: number;
  efficiency: number;
  rating: number;
}

export interface SpringPaginatedResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
