import authClient from "@/config/axios";
import type {
  WasteCategory,
  CreateWasteTypeRequest,
} from "@/types/WasteCategory";

const wasteReportService = {
  async getAll(): Promise<WasteCategory[]> {
    const res = await authClient.get<WasteCategory[]>("/admin/waste-types");
    return res.data;
  },

  async create(payload: CreateWasteTypeRequest): Promise<WasteCategory> {
    const res = await authClient.post<WasteCategory>(
      "/admin/waste-types",
      payload
    );
    return res.data;
  },
};

export default wasteReportService;
