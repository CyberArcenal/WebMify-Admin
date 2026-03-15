// src/api/project_feature.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface ProjectFeature {
  id: number;
  project: number;
  project_title?: string;
  description: string;
  order: number;
}

export interface ProjectFeatureCreateData {
  project: number;
  description: string;
  order?: number;
}

export type ProjectFeatureUpdateData = Partial<ProjectFeatureCreateData>;

export interface ProjectFeatureListParams {
  project_id?: number;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class ProjectFeatureAPI {
  private basePath = "/api/v2/portfolio/projects/";

  async list(params?: {
    project_id?: number;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<ProjectFeature>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ProjectFeature>>(
        `${this.basePath}features/`,
        { params },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch project features",
      );
    }
  }

  async get(id: number): Promise<ProjectFeature> {
    try {
      const response = await apiClient.get<{
        status: boolean;
        message: string;
        result: ProjectFeature;
      }>(`${this.basePath}features/${id}/`);
      return response.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch project feature",
      );
    }
  }

  async create(
    projectId: number,
    data: Omit<ProjectFeatureCreateData, "project">,
  ): Promise<ProjectFeature> {
    try {
      const payload = { ...data, project: projectId };
      const response = await apiClient.post<{
        status: boolean;
        message: string;
        result: ProjectFeature;
      }>(`${this.basePath}features/`, payload);
      return response.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to create project feature",
      );
    }
  }

  async update(
    id: number,
    data: ProjectFeatureUpdateData,
  ): Promise<ProjectFeature> {
    try {
      const response = await apiClient.put<{
        status: boolean;
        message: string;
        result: ProjectFeature;
      }>(`${this.basePath}features/${id}/`, data);
      return response.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to update project feature",
      );
    }
  }

  async patch(
    id: number,
    data: ProjectFeatureUpdateData,
  ): Promise<ProjectFeature> {
    try {
      const response = await apiClient.patch<{
        status: boolean;
        message: string;
        result: ProjectFeature;
      }>(`${this.basePath}features/${id}/`, data);
      return response.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to patch project feature",
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}features/${id}/`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to delete project feature",
      );
    }
  }
}

const projectFeatureAPI = new ProjectFeatureAPI();
export default projectFeatureAPI;
