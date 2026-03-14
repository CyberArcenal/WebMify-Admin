// src/api/project_techstack.ts
import { apiClient } from "@/lib/fetcher";

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

export type ProjectTechStackUpdateData = Partial<Omit<ProjectTechStackCreateData, 'project'>>;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class ProjectTechStackAPI {
  private basePath = '/api/v2/portfolio/projects/';

  async list(projectId: number, params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<ProjectTechStack>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ProjectTechStack>>(`${this.basePath}${projectId}/techstack/`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch tech stack items');
    }
  }

  async get(projectId: number, id: number): Promise<ProjectTechStack> {
    try {
      const response = await apiClient.get<ProjectTechStack>(`${this.basePath}${projectId}/techstack/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch tech stack item');
    }
  }

  async create(projectId: number, data: Omit<ProjectTechStackCreateData, 'project'>): Promise<ProjectTechStack> {
    try {
      const payload = { ...data, project: projectId };
      const response = await apiClient.post<ProjectTechStack>(`${this.basePath}${projectId}/techstack/`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create tech stack item');
    }
  }

  async update(projectId: number, id: number, data: ProjectTechStackUpdateData): Promise<ProjectTechStack> {
    try {
      const response = await apiClient.put<ProjectTechStack>(`${this.basePath}${projectId}/techstack/${id}/`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update tech stack item');
    }
  }

  async patch(projectId: number, id: number, data: ProjectTechStackUpdateData): Promise<ProjectTechStack> {
    try {
      const response = await apiClient.patch<ProjectTechStack>(`${this.basePath}${projectId}/techstack/${id}/`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch tech stack item');
    }
  }

  async delete(projectId: number, id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${projectId}/techstack/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete tech stack item');
    }
  }
}

const projectTechStackAPI = new ProjectTechStackAPI();
export default projectTechStackAPI;