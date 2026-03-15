// src/api/project_gallery.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface ProjectGalleryImage {
  id: number;
  project: number;
  project_title?: string;
  image: string; // URL
  image_url: string;
  order: number;
}

export interface ProjectGalleryImageCreateData {
  project: number;
  image: File;
  order?: number;
}

export type ProjectGalleryImageUpdateData = Partial<Omit<ProjectGalleryImageCreateData, 'project'>>;

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class ProjectGalleryAPI {
  private basePath = '/api/v2/portfolio/projects/';

  async list(params?: { page?: number; page_size?: number, project_id?: number }): Promise<PaginatedResponse<ProjectGalleryImage>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ProjectGalleryImage>>(
        `${this.basePath}gallery/`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch gallery images');
    }
  }

  async get(id: number): Promise<ProjectGalleryImage> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: ProjectGalleryImage }>(
        `${this.basePath}gallery/${id}/` 
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch gallery image');
    }
  }

  async create(projectId: number, data: Omit<ProjectGalleryImageCreateData, 'project'>): Promise<ProjectGalleryImage> {
    try {
      const formData = new FormData();
      formData.append('project', String(projectId));
      if (data.image) formData.append('image', data.image);
      if (data.order !== undefined) formData.append('order', String(data.order));
      const response = await apiClient.post<{ status: boolean; message: string; result: ProjectGalleryImage }>(
        `${this.basePath}gallery/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create gallery image');
    }
  }

  async update(id: number, data: ProjectGalleryImageUpdateData): Promise<ProjectGalleryImage> {
    try {
      const formData = new FormData();
      if (data.image) formData.append('image', data.image);
      if (data.order !== undefined) formData.append('order', String(data.order));
      const response = await apiClient.put<{ status: boolean; message: string; result: ProjectGalleryImage }>(
        `${this.basePath}gallery/${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update gallery image');
    }
  }

  async patch(id: number, data: ProjectGalleryImageUpdateData): Promise<ProjectGalleryImage> {
    try {
      const formData = new FormData();
      if (data.image) formData.append('image', data.image);
      if (data.order !== undefined) formData.append('order', String(data.order));
      const response = await apiClient.patch<{ status: boolean; message: string; result: ProjectGalleryImage }>(
        `${this.basePath}gallery/${id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch gallery image');
    }
  }

  async delete(projectId: number, id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}gallery/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete gallery image');
    }
  }
}

const projectGalleryAPI = new ProjectGalleryAPI();
export default projectGalleryAPI;