// src/api/dashboard.ts
import { apiClient } from "@/lib/fetcher";

export interface DashboardStats {
  total_blogs: number;
  total_projects: number;
  total_testimonials: number;
  total_subscribers: number;
  total_messages: number;
  total_views: number;
}

export interface RecentBlog {
  id: number;
  title: string;
  published_date: string;
  views: number;
}

export interface RecentMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  created_at: string;
  is_read: boolean;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_blogs: RecentBlog[];
  recent_messages: RecentMessage[];
}

class DashboardAPI {
  /**
   * Get admin dashboard data (cached for 1 hour on backend).
   */
  async getDashboard(): Promise<DashboardData> {
    try {
      const response = await apiClient.get<DashboardData>('/api/v2/portfolio/dashboard/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch dashboard data');
    }
  }
}

const dashboardAPI = new DashboardAPI();
export default dashboardAPI;