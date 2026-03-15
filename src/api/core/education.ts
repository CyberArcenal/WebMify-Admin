// src/api/education.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  institution_logo_url: string | null;
  duration: string;
  order: number;
}

export interface EducationCreateData {
  institution: string;
  degree: string;
  field_of_study: string;
  description?: string;
  start_date: string;
  end_date?: string | null;
  current?: boolean;
  institution_logo?: File | null;
  order?: number;
}

export type EducationUpdateData = Partial<EducationCreateData>;

export interface EducationListParams {
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

class EducationAPI {
  private basePath = '/api/v2/portfolio/education/';

  async list(params?: EducationListParams): Promise<PaginatedResponse<Education>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Education>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch education records');
    }
  }

  async get(id: number): Promise<Education> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: Education }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch education record');
    }
  }

  async create(data: EducationCreateData): Promise<Education> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'institution_logo' && value instanceof File) {
            formData.append('institution_logo', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.post<{ status: boolean; message: string; result: Education }>(
        this.basePath,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create education record');
    }
  }

  async update(id: number, data: EducationUpdateData): Promise<Education> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'institution_logo' && value instanceof File) {
            formData.append('institution_logo', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.put<{ status: boolean; message: string; result: Education }>(
        `${this.basePath}${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update education record');
    }
  }

  async patch(id: number, data: EducationUpdateData): Promise<Education> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'institution_logo' && value instanceof File) {
            formData.append('institution_logo', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.patch<{ status: boolean; message: string; result: Education }>(
        `${this.basePath}${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch education record');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete education record');
    }
  }
}

const educationAPI = new EducationAPI();
export default educationAPI;