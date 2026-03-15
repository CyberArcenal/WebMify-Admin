// src/api/skill.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface Skill {
  id: number;
  name: string;
  category: string;
  category_display: string;
  proficiency: number;
  icon: string;
  order: number;
  featured: boolean;
}

export interface SkillCreateData {
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  order?: number;
  featured?: boolean;
}

export type SkillUpdateData = Partial<SkillCreateData>;

export interface SkillListParams {
  category?: string;
  featured?: boolean;
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

class SkillAPI {
  private basePath = '/api/v2/portfolio/skills/';

  async list(params?: SkillListParams): Promise<PaginatedResponse<Skill>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Skill>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch skills');
    }
  }

  async get(id: number): Promise<Skill> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: Skill }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch skill');
    }
  }

  async create(data: SkillCreateData): Promise<Skill> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string; result: Skill }>(
        this.basePath,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create skill');
    }
  }

  async update(id: number, data: SkillCreateData): Promise<Skill> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string; result: Skill }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update skill');
    }
  }

  async patch(id: number, data: SkillUpdateData): Promise<Skill> {
    try {
      const response = await apiClient.patch<{ status: boolean; message: string; result: Skill }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch skill');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete skill');
    }
  }
}

const skillAPI = new SkillAPI();
export default skillAPI;