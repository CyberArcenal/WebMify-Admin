// src/api/comment.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface CommentAuthor {
  id: number | null;
  name: string;
  email?: string;
  avatar?: string | null;
}

export interface CommentContentObject {
  type: 'blog' | 'project';
  id: number;
  title: string;
  url: string;
}

export interface Comment {
  id: number;
  author: CommentAuthor;
  content: string;
  created_at: string;
  approved: boolean;
  content_object: CommentContentObject | null;
  created_at_display: string;
  parent: number | null;
  replies: Comment[];
}

export interface CommentCreateData {
  name?: string;
  email?: string;
  content: string;
  parent?: number | null;
  blog?: number | null;
  project?: number | null;
}

export type CommentUpdateData = Partial<CommentCreateData> & { approved?: boolean };

export interface CommentListParams {
  content_type?: string;
  object_id?: number;
  approved?: boolean;
  parent?: string | number;
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

class CommentAPI {
  private basePath = '/api/v2/portfolio/comments/';

  async list(params?: CommentListParams): Promise<PaginatedResponse<Comment>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Comment>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch comments');
    }
  }

  async get(id: number): Promise<Comment> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: Comment }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch comment');
    }
  }

  async create(data: CommentCreateData): Promise<Comment> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string; result: Comment }>(
        this.basePath,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create comment');
    }
  }

  async update(id: number, data: CommentUpdateData): Promise<Comment> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string; result: Comment }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update comment');
    }
  }

  async patch(id: number, data: CommentUpdateData): Promise<Comment> {
    try {
      const response = await apiClient.patch<{ status: boolean; message: string; result: Comment }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch comment');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete comment');
    }
  }
}

const commentAPI = new CommentAPI();
export default commentAPI;