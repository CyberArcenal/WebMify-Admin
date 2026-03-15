// src/api/testimonial.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface Testimonial {
  id: number;
  author: string;
  author_title: string;
  content: string;
  rating: number;
  author_image_url: string | null;
  featured: boolean;
  approved: boolean;
  created_at: string;
}

export interface TestimonialCreateData {
  author: string;
  author_title: string;
  content: string;
  rating?: number;
  author_image?: File | null;
  featured?: boolean;
  approved?: boolean;
}

export type TestimonialUpdateData = Partial<TestimonialCreateData>;

export interface TestimonialListParams {
  featured?: boolean;
  approved?: boolean;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class TestimonialAPI {
  private basePath = '/api/v2/portfolio/testimonials/';

  async list(params?: TestimonialListParams): Promise<PaginatedResponse<Testimonial>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Testimonial>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch testimonials');
    }
  }

  async get(id: number): Promise<Testimonial> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: Testimonial }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch testimonial');
    }
  }

  async create(data: TestimonialCreateData): Promise<Testimonial> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'author_image' && value instanceof File) {
            formData.append('author_image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.post<{ status: boolean; message: string; result: Testimonial }>(
        this.basePath,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create testimonial');
    }
  }

  async update(id: number, data: TestimonialCreateData): Promise<Testimonial> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'author_image' && value instanceof File) {
            formData.append('author_image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.put<{ status: boolean; message: string; result: Testimonial }>(
        `${this.basePath}${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update testimonial');
    }
  }

  async patch(id: number, data: TestimonialUpdateData): Promise<Testimonial> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'author_image' && value instanceof File) {
            formData.append('author_image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.patch<{ status: boolean; message: string; result: Testimonial }>(
        `${this.basePath}${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch testimonial');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete testimonial');
    }
  }
}

const testimonialAPI = new TestimonialAPI();
export default testimonialAPI;