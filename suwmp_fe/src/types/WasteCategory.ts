export type WasteCategory = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type CreateWasteTypeRequest = {
  name: string;
  description?: string;
};
