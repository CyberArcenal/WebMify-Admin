// src/api/category.ts
import { apiClient } from "@/lib/fetcher";

export interface Category {
  updated_at: string | Date | null | undefined;
  created_at: string | Date | null | undefined;
  id: number;
  name: string;
  slug: string;
  description: string;
  featured: boolean;
}

export interface CategoryCreateData {
  name: string;
  slug?: string;
  description?: string;
  featured?: boolean;
}

export type CategoryUpdateData = Partial<CategoryCreateData>;

export interface CategoryListParams {
  featured?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class CategoryAPI {
  private basePath = '/api/v2/portfolio/categories/';

  async list(params?: CategoryListParams): Promise<PaginatedResponse<Category>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Category>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch categories');
    }
  }

  async get(id: number): Promise<Category> {
    try {
      const response = await apiClient.get<Category>(`${this.basePath}${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch category');
    }
  }

  async create(data: CategoryCreateData): Promise<Category> {
    try {
      const response = await apiClient.post<Category>(this.basePath, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create category');
    }
  }

  async update(id: number, data: CategoryCreateData): Promise<Category> {
    try {
      const response = await apiClient.put<Category>(`${this.basePath}${id}/`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update category');
    }
  }

  async patch(id: number, data: CategoryUpdateData): Promise<Category> {
    try {
      const response = await apiClient.patch<Category>(`${this.basePath}${id}/`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch category');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete category');
    }
  }
}

const categoryAPI = new CategoryAPI();
export default categoryAPI;