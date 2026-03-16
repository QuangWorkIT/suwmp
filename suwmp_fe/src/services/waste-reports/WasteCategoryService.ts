import authClient from "@/config/axios";
import type {
  WasteCategory,
  CreateWasteCategoryRequest,
} from "@/types/WasteCategory";

const wasteCategoryService = {
  async getAll(): Promise<WasteCategory[]> {
    const res = await authClient.get<WasteCategory[]>("/admin/waste-types");
    return res.data;
  },

  async create(payload: CreateWasteCategoryRequest): Promise<WasteCategory> {
    const res = await authClient.post<WasteCategory>(
      "/admin/waste-types",
      payload
    );
    return res.data;
  },
};

export default wasteCategoryService;
