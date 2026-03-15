// src/api/experience.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  company_logo_url: string | null;
  duration: string;
  order: number;
}

export interface ExperienceCreateData {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  current?: boolean;
  company_logo?: File | null;
  order?: number;
}

export type ExperienceUpdateData = Partial<ExperienceCreateData>;

export interface ExperienceListParams {
  current?: boolean;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class ExperienceAPI {
  private basePath = '/api/v2/portfolio/experiences/';

  async list(params?: ExperienceListParams): Promise<PaginatedResponse<Experience>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Experience>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch experiences');
    }
  }

  async get(id: number): Promise<Experience> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: Experience }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch experience');
    }
  }

  async create(data: ExperienceCreateData): Promise<Experience> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'company_logo' && value instanceof File) {
            formData.append('company_logo', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.post<{ status: boolean; message: string; result: Experience }>(
        this.basePath,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create experience');
    }
  }

  async update(id: number, data: ExperienceUpdateData): Promise<Experience> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'company_logo' && value instanceof File) {
            formData.append('company_logo', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.put<{ status: boolean; message: string; result: Experience }>(
        `${this.basePath}${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update experience');
    }
  }

  async patch(id: number, data: ExperienceUpdateData): Promise<Experience> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'company_logo' && value instanceof File) {
            formData.append('company_logo', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.patch<{ status: boolean; message: string; result: Experience }>(
        `${this.basePath}${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch experience');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete experience');
    }
  }
}

const experienceAPI = new ExperienceAPI();
export default experienceAPI;