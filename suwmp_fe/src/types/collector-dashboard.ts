export interface DashboardSummary {
  totalTasksToday: number;
  completedTasksToday: number;
  remainingTasksToday: number;
  avgResponseTimeMins: number;
  averageRating: number;
  estimatedCompletionTime: string;
  scheduleStatus: string;
}

export interface DashboardTask {
  taskId: number;
  wasteType: string;
  status: string;
  distanceKm: number;
  estimatedMins: number;
  citizenName: string;
  priority: boolean;
}

export interface DashboardFeedback {
  id?: number;
  name?: string;
  citizenName?: string;
  date?: string;
  createdAt?: string;
  rating: number;
  comment: string;
}

export interface DashboardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
