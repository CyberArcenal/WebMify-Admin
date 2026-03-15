// src/api/subscriber.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  confirmed: boolean;
  confirmation_token: string;
  unsubscribe_token: string;
}

export interface SubscriberCreateData {
  email: string;
}

export type SubscriberUpdateData = Partial<Pick<Subscriber, 'is_active' | 'confirmed'>>;

export interface SubscriberListParams {
  is_active?: boolean;
  confirmed?: boolean;
  email?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class SubscriberAPI {
  private basePath = '/api/v2/portfolio/subscribers/';

  async list(params?: SubscriberListParams): Promise<PaginatedResponse<Subscriber>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Subscriber>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch subscribers');
    }
  }

  async get(id: number): Promise<Subscriber> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: Subscriber }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch subscriber');
    }
  }

  async create(data: SubscriberCreateData): Promise<Subscriber> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string; result: Subscriber }>(
        '/api/v2/portfolio/subscribe/',
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to subscribe');
    }
  }

  async update(id: number, data: SubscriberUpdateData): Promise<Subscriber> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string; result: Subscriber }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update subscriber');
    }
  }

  async patch(id: number, data: SubscriberUpdateData): Promise<Subscriber> {
    try {
      const response = await apiClient.patch<{ status: boolean; message: string; result: Subscriber }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch subscriber');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete subscriber');
    }
  }
}

const subscriberAPI = new SubscriberAPI();
export default subscriberAPI;