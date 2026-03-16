// src/api/notifyLog.ts
import { apiClient } from "@/lib/fetcher";
import type { Pagination } from "../utils";

export interface NotifyLog {
  id: number;
  recipient_email: string;
  subject: string | null;
  payload: string | null;
  status: "queued" | "sent" | "failed" | "resend";
  error_message: string | null;
  channel: string;
  priority: string;
  message_id: string | null;
  duration_ms: number | null;
  retry_count: number;
  resend_count: number;
  sent_at: string | null;
  last_error_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotifyLogCreateData {
  recipient_email: string;
  subject?: string | null;
  payload?: string | null;
  status?: NotifyLog["status"];
  error_message?: string | null;
  channel?: string;
  priority?: string;
  message_id?: string | null;
  duration_ms?: number | null;
  retry_count?: number;
  resend_count?: number;
  sent_at?: string | null;
  last_error_at?: string | null;
}

export type NotifyLogUpdateData = Partial<NotifyLogCreateData>;

export interface NotifyLogListParams {
  status?: NotifyLog["status"];
  recipient_email?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class NotifyLogAPI {
  private basePath = "/api/v2/portfolio/notifylogs/";

  /**
   * List notification logs (staff only).
   */
  async list(params?: NotifyLogListParams): Promise<PaginatedResponse<NotifyLog>> {
    try {
      const response = await apiClient.get<PaginatedResponse<NotifyLog>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch notification logs");
    }
  }

  /**
   * Retrieve a single log entry by ID (staff only).
   */
  async get(id: number): Promise<NotifyLog> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: NotifyLog }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch notification log");
    }
  }

  /**
   * Create a new log entry (staff only – usually system-generated).
   */
  async create(data: NotifyLogCreateData): Promise<NotifyLog> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string; result: NotifyLog }>(
        this.basePath,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to create notification log");
    }
  }

  /**
   * Fully update a log entry (staff only).
   */
  async update(id: number, data: NotifyLogCreateData): Promise<NotifyLog> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string; result: NotifyLog }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to update notification log");
    }
  }

  /**
   * Partially update a log entry (staff only).
   */
  async patch(id: number, data: NotifyLogUpdateData): Promise<NotifyLog> {
    try {
      const response = await apiClient.patch<{ status: boolean; message: string; result: NotifyLog }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to update notification log");
    }
  }

  /**
   * Delete a log entry (staff only).
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to delete notification log");
    }
  }
}

const notifyLogAPI = new NotifyLogAPI();
export default notifyLogAPI;