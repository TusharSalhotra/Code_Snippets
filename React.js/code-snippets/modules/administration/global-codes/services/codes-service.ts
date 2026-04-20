import apiConfig from "@/config/api-config";
import { ApiResponse, endpoints } from "@/lib/api";
import { APICode, Code, CodeCategory } from "../schema/types";

type GetCodesParams = {
  globalCodeId: number;
  categoryId: number;
  category: string;
  companyId: number;
  inActiveRecords: boolean;
};
export class GlobalCodesService {
  public async getAll(category: CodeCategory): Promise<Code[]> {
    const endpoint = endpoints.getGlobalCodes();
    const res = await apiConfig.POST<ApiResponse<APICode[]>, GetCodesParams>(
      endpoint,
      {
        globalCodeId: 0,
        categoryId: category.categoryId,
        category: category.category,
        companyId: 1,
        inActiveRecords: true,
      },
    );

    return (res.data.data ?? []).map((code) => ({
      id: code.globalCodeId.toString(),
      category: {
        categoryId: code.categoryId,
        category: category.category,
      },
      code: code.codeName,
      description: code.description,
      tomrexName: code.friendlyName,
      active: code.active === "Y",
      cannotModify: code.cannotModifyNameOrDelete === "Y",
    }));
  }

  public async create(data: Omit<Code, "id">): Promise<Code> {
    const endpoint = endpoints.createGlobalCode();
    const res = await apiConfig.POST(endpoint, data);
    return res.data as Code;
  }

  public async update(id: string, data: Partial<Code>): Promise<Code> {
    const endpoint = endpoints.updateGlobalCode(id);
    const res = await apiConfig.PUT(endpoint, data);
    return res.data as Code;
  }

  public async delete(id: string): Promise<void> {
    const endpoint = endpoints.deleteGlobalCode(id);
    await apiConfig.DELETE(endpoint);
  }

  public async getCategories(): Promise<CodeCategory[]> {
    const endpoint = endpoints.getGlobalCodesCategories();
    const res = await apiConfig.GET<ApiResponse<CodeCategory[]>>(endpoint);
    return res.data.data as CodeCategory[];
  }
}

// Create a singleton instance
export const globalCodesService = new GlobalCodesService();
