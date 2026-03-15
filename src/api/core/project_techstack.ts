// src/api/project_techstack.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface ProjectTechStack {
  id: number;
  project: number;
  project_title?: string;
  name: string;
  category: string;
  icon: string;
  order: number;
}

export interface ProjectTechStackCreateData {
  project: number;
  name: string;
  category?: string;
  icon?: string;
  order?: number;
}

export type ProjectTechStackUpdateData = Partial<
  Omit<ProjectTechStackCreateData, "project">
>;

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class ProjectTechStackAPI {
  private basePath = "/api/v2/portfolio/projects/";

  async list(params?: {
    project_id?: number;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<ProjectTechStack>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ProjectTechStack>>(
        `${this.basePath}techstack/`,
        { params },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch tech stack items",
      );
    }
  }

  async get(id: number): Promise<ProjectTechStack> {
    try {
      const response = await apiClient.get<{
        status: boolean;
        message: string;
        result: ProjectTechStack;
      }>(`${this.basePath}techstack/${id}/`);
      return response.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch tech stack item",
      );
    }
  }

  async create(
    projectId: number,
    data: Omit<ProjectTechStackCreateData, "project">,
  ): Promise<ProjectTechStack> {
    try {
      const payload = { ...data, project: projectId };
      const response = await apiClient.post<{
        status: boolean;
        message: string;
        result: ProjectTechStack;
      }>(`${this.basePath}techstack/`, payload);
      return response.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to create tech stack item",
      );
    }
  }

  async update(
    id: number,
    data: ProjectTechStackUpdateData,
  ): Promise<ProjectTechStack> {
    try {
      const response = await apiClient.put<{
        status: boolean;
        message: string;
        result: ProjectTechStack;
      }>(`${this.basePath}techstack/${id}/`, data);
      return response.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to update tech stack item",
      );
    }
  }

  async patch(
    id: number,
    data: ProjectTechStackUpdateData,
  ): Promise<ProjectTechStack> {
    try {
      const response = await apiClient.patch<{
        status: boolean;
        message: string;
        result: ProjectTechStack;
      }>(`${this.basePath}/techstack/${id}/`, data);
      return response.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to patch tech stack item",
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}techstack/${id}/`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to delete tech stack item",
      );
    }
  }
}

const projectTechStackAPI = new ProjectTechStackAPI();
export default projectTechStackAPI;
