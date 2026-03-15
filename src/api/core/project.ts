// src/api/project.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface ProjectFeature {
  description: string;
}

export interface ProjectGalleryImage {
  image_url: string;
}

export interface ProjectTechStack {
  name: string;
  category: string;
  icon: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  project_type: string;
  image_url: string | null;
  demo_url: string;
  source_code_url: string;
  technologies_list: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
  client: string;
  development_time: string;
  impact_stats: {
    sales_increase: string;
    load_time: string;
    users: string;
    test_coverage: string;
  };
  testimonial: {
    content: string;
    author: string;
    position: string;
  } | null;
  features: ProjectFeature[];
  challenges: string;
  solutions: string;
  gallery_images: ProjectGalleryImage[];
  tech_stack_details: ProjectTechStack[];
  views: number;
}

export interface ProjectCreateData {
  title: string;
  description: string;
  project_type?: string;
  image?: File | null;
  demo_url?: string;
  source_code_url?: string;
  technologies: string;
  featured?: boolean;
}

export type ProjectUpdateData = Partial<ProjectCreateData>;

export interface ProjectListParams {
  featured?: boolean;
  project_type?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class ProjectAPI {
  private basePath = '/api/v2/portfolio/projects/';

  async list(params?: ProjectListParams): Promise<PaginatedResponse<Project>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Project>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch projects');
    }
  }

  async get(id: number): Promise<Project> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: Project }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch project');
    }
  }

  async create(data: ProjectCreateData): Promise<Project> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.post<{ status: boolean; message: string; result: Project }>(
        this.basePath,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create project');
    }
  }

  async update(id: number, data: ProjectCreateData): Promise<Project> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.put<{ status: boolean; message: string; result: Project }>(
        `${this.basePath}${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update project');
    }
  }

  async patch(id: number, data: ProjectUpdateData): Promise<Project> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.patch<{ status: boolean; message: string; result: Project }>(
        `${this.basePath}${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch project');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete project');
    }
  }
}

const projectAPI = new ProjectAPI();
export default projectAPI;