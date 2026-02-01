export type WasteCategory = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type CreateWasteCategoryRequest = {
  name: string;
  description?: string;
};
