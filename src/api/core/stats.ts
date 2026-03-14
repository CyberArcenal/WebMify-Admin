// src/api/stats.ts
import { apiClient } from "@/lib/fetcher";

export interface Stats {
  id?: number;
  projects_completed: number;
  client_satisfaction: number;
  years_experience: number;
  happy_clients: number;
}

export type StatsCreateUpdateData = Omit<Stats, 'id'>;

class StatsAPI {
  private basePath = '/api/v2/portfolio/stats/';

  async get(): Promise<Stats> {
    try {
      const response = await apiClient.get<Stats>(this.basePath);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch stats');
    }
  }

  async create(data: StatsCreateUpdateData): Promise<Stats> {
    try {
      const response = await apiClient.post<Stats>(this.basePath, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create stats');
    }
  }

  async update(data: StatsCreateUpdateData): Promise<Stats> {
    try {
      const response = await apiClient.put<Stats>(this.basePath, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update stats');
    }
  }

  async patch(data: Partial<StatsCreateUpdateData>): Promise<Stats> {
    try {
      const response = await apiClient.patch<Stats>(this.basePath, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch stats');
    }
  }

  async delete(): Promise<void> {
    try {
      await apiClient.delete(this.basePath);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete stats');
    }
  }
}

const statsAPI = new StatsAPI();
export default statsAPI;