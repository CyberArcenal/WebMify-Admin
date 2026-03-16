// src/api/notification.ts
import { apiClient } from "@/lib/fetcher";
import type { Pagination } from "../utils";

export interface Notification {
  id: number;
  user: number; // user ID
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "project" | "product" | "skill" | "message" | "portfolio";
  is_read: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationCreateData {
  user: number;
  title: string;
  message: string;
  type?: Notification["type"];
  metadata?: Record<string, any>;
}

export type NotificationUpdateData = Partial<NotificationCreateData> & {
  is_read?: boolean;
};

export interface NotificationListParams {
  is_read?: boolean;
  type?: Notification["type"];
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class NotificationAPI {
  private basePath = "/api/v2/portfolio/notifications/";

  /**
   * List notifications for the current user.
   * Staff can see all notifications.
   */
  async list(params?: NotificationListParams): Promise<PaginatedResponse<Notification>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Notification>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch notifications");
    }
  }

  /**
   * Retrieve a single notification by ID.
   */
  async get(id: number): Promise<Notification> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: Notification }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch notification");
    }
  }

  /**
   * Create a new notification (staff only).
   */
  async create(data: NotificationCreateData): Promise<Notification> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string; result: Notification }>(
        this.basePath,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to create notification");
    }
  }

  /**
   * Fully update a notification (staff only).
   */
  async update(id: number, data: NotificationCreateData): Promise<Notification> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string; result: Notification }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to update notification");
    }
  }

  /**
   * Partially update a notification.
   * - Staff can update any field.
   * - Regular users can only mark as read (patch is_read).
   */
  async patch(id: number, data: NotificationUpdateData): Promise<Notification> {
    try {
      const response = await apiClient.patch<{ status: boolean; message: string; result: Notification }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to update notification");
    }
  }

  /**
   * Delete a notification (staff only).
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to delete notification");
    }
  }

  /**
   * Convenience method to mark a notification as read.
   */
  async markAsRead(id: number): Promise<Notification> {
    return this.patch(id, { is_read: true });
  }

  /**
   * Mark all notifications of the current user as read.
   * This calls a custom endpoint – you'll need to implement it in backend if desired.
   * Currently not part of the CRUD, but you can add a separate method if you create that endpoint.
   */
  // async markAllAsRead(): Promise<void> { ... }
}

const notificationAPI = new NotificationAPI();
export default notificationAPI;