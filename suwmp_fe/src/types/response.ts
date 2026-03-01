export type PaginatedResponse<T> = {
    data: T[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
} 