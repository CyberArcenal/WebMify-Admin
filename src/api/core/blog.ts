// src/api/blog.ts
import { apiClient } from "@/lib/fetcher";
import type { Category } from "./category";
import { Pagination } from "../utils";

export interface BlogAuthor {
  name: string;
  bio: string;
  image_url: string | null;
}

export interface Blog {
  id: number;
  author: BlogAuthor;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  status: "draft" | "published";
  status_display: string;
  published_date: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  featured: boolean;
  publishDate: string | null;
  summary: string;
  imageURL: string | null;
  categories: Category[]; // Minimal category (id, name, slug)
}

export interface BlogCreateData {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  featured: boolean;
  featured_image?: File | null;
  status?: "draft" | "published";
  categories?: number[];
}

export type BlogUpdateData = Partial<BlogCreateData>;

export interface BlogListParams {
  search?: string;
  featured?: boolean;
  category?: string; // slug
  status?: "draft" | "published";
  author_id?: number;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class BlogAPI {
  private basePath = "/api/v2/portfolio/blogs/";

  async list(params?: BlogListParams): Promise<PaginatedResponse<Blog>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Blog>>(
        this.basePath,
        { params },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch blogs");
    }
  }

  async get(id: number): Promise<Blog> {
    try {
      const response = await apiClient.get<Blog>(`${this.basePath}${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch blog");
    }
  }

  async getBySlug(slug: string): Promise<Blog> {
    try {
      const response = await apiClient.get<Blog>(
        `${this.basePath}by-slug/${slug}/`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch blog");
    }
  }

  async create(data: BlogCreateData): Promise<Blog> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "categories" && Array.isArray(value)) {
            value.forEach((id) => formData.append("categories", id.toString()));
          } else if (key === "featured_image" && value instanceof File) {
            formData.append("featured_image", value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.post<Blog>(this.basePath, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to create blog");
    }
  }

  async update(id: number, data: BlogUpdateData): Promise<Blog> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "categories" && Array.isArray(value)) {
            value.forEach((id) => formData.append("categories", id.toString()));
          } else if (key === "featured_image" && value instanceof File) {
            formData.append("featured_image", value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.put<Blog>(
        `${this.basePath}${id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to update blog");
    }
  }

  async patch(id: number, data: BlogUpdateData): Promise<Blog> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "categories" && Array.isArray(value)) {
            value.forEach((id) => formData.append("categories", id.toString()));
          } else if (key === "featured_image" && value instanceof File) {
            formData.append("featured_image", value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.patch<Blog>(
        `${this.basePath}${id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to patch blog");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to delete blog");
    }
  }

  async getPopular(): Promise<
    {
      id: number;
      title: string;
      publishDate: string;
      imageURL: string | null;
      slug: string;
      views: number;
    }[]
  > {
    try {
      const response = await apiClient.get("/api/v2/portfolio/blog/popular/");
      // Assuming response.data.data is the array
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch popular blogs",
      );
    }
  }
}

const blogAPI = new BlogAPI();
export default blogAPI;
