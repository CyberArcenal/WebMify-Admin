// src/api/project_feature.ts
import { apiClient } from "@/lib/fetcher";

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
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class ProjectFeatureAPI {
  private basePath = '/api/v2/portfolio/projects/';

  async list(projectId: number, params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<ProjectFeature>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ProjectFeature>>(`${this.basePath}${projectId}/features/`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch project features');
    }
  }

  async get(projectId: number, id: number): Promise<ProjectFeature> {
    try {
      const response = await apiClient.get<ProjectFeature>(`${this.basePath}${projectId}/features/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch project feature');
    }
  }

  async create(projectId: number, data: Omit<ProjectFeatureCreateData, 'project'>): Promise<ProjectFeature> {
    try {
      const payload = { ...data, project: projectId };
      const response = await apiClient.post<ProjectFeature>(`${this.basePath}${projectId}/features/`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create project feature');
    }
  }

  async update(projectId: number, id: number, data: ProjectFeatureUpdateData): Promise<ProjectFeature> {
    try {
      const response = await apiClient.put<ProjectFeature>(`${this.basePath}${projectId}/features/${id}/`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update project feature');
    }
  }

  async patch(projectId: number, id: number, data: ProjectFeatureUpdateData): Promise<ProjectFeature> {
    try {
      const response = await apiClient.patch<ProjectFeature>(`${this.basePath}${projectId}/features/${id}/`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch project feature');
    }
  }

  async delete(projectId: number, id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${projectId}/features/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete project feature');
    }
  }
}

const projectFeatureAPI = new ProjectFeatureAPI();
export default projectFeatureAPI;