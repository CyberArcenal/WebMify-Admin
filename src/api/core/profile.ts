// src/api/profile.ts
import { apiClient } from "@/lib/fetcher";

export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  profile_image_url: string | null;
  resume_url: string | null;
  email: string;
  phone: string;
  address: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  created_at: string;
  updated_at: string;
  status: string;
  status_display?: string;
}

export interface ProfileCreateData {
  name: string;
  title: string;
  bio: string;
  profile_image?: File | null;
  resume?: string | null; // URL string
  email: string;
  phone?: string;
  address?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

export type ProfileUpdateData = Partial<ProfileCreateData>;

class ProfileAPI {
  private basePath = '/api/v2/portfolio/profile/';

  /**
   * Get profile (there should be only one).
   */
  async get(): Promise<Profile> {
    try {
      const response = await apiClient.get<Profile>(this.basePath);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch profile');
    }
  }

  /**
   * Create profile (admin only).
   */
  async create(data: ProfileCreateData): Promise<Profile> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'profile_image' && value instanceof File) {
            formData.append('profile_image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.post<Profile>(this.basePath, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create profile');
    }
  }

  /**
   * Full update of profile (admin only).
   */
  async update(id: number, data: ProfileCreateData): Promise<Profile> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'profile_image' && value instanceof File) {
            formData.append('profile_image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.put<Profile>(`${this.basePath}${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update profile');
    }
  }

  /**
   * Partial update of profile (admin only).
   */
  async patch(id: number, data: ProfileUpdateData): Promise<Profile> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'profile_image' && value instanceof File) {
            formData.append('profile_image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.patch<Profile>(`${this.basePath}${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch profile');
    }
  }

  /**
   * Delete profile (admin only).
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete profile');
    }
  }

  /**
   * Get location info (from profile).
   */
  async getLocation(): Promise<{ email: string; phone: string; address: string; coordinates: string; availability: string; }> {
    try {
      const response = await apiClient.get('/api/v2/portfolio/location/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch location');
    }
  }

  /**
   * Get social media links.
   */
  async getSocialLinks(): Promise<{
    github_url: string;
    linkedin_url: string;
    twitter_url: string;
    instagram_url: string;
    facebook_url: string;
    youtube_url: string;
  }> {
    try {
      const response = await apiClient.get('/api/v2/portfolio/social-links/');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch social links');
    }
  }
}

const profileAPI = new ProfileAPI();
export default profileAPI;