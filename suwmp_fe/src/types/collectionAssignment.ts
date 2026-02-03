export type CreateCollectionAssignment = {
    wasteReportId: number;
    enterpriseId: number;
    collectorId: string | null;
    assignedAt: Date | null;
    startCollectAt: Date | null;
}