// src/api/email_template.ts
import { apiClient } from "@/lib/fetcher";
import { Pagination } from "../utils";

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  created_at: string;
  modified_at: string;
}

export interface EmailTemplateCreateData {
  name: string;
  subject: string;
  content: string;
}

export type EmailTemplateUpdateData = Partial<EmailTemplateCreateData>;

export interface EmailTemplateListParams {
  name?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: Pagination;
  results: T[];
}

class EmailTemplateAPI {
  private basePath = '/api/v2/portfolio/email-templates/';

  async list(params?: EmailTemplateListParams): Promise<PaginatedResponse<EmailTemplate>> {
    try {
      const response = await apiClient.get<PaginatedResponse<EmailTemplate>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch email templates');
    }
  }

  async get(id: number): Promise<EmailTemplate> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: EmailTemplate }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch email template');
    }
  }

  async create(data: EmailTemplateCreateData): Promise<EmailTemplate> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string; result: EmailTemplate }>(
        this.basePath,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create email template');
    }
  }

  async update(id: number, data: EmailTemplateCreateData): Promise<EmailTemplate> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string; result: EmailTemplate }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update email template');
    }
  }

  async patch(id: number, data: EmailTemplateUpdateData): Promise<EmailTemplate> {
    try {
      const response = await apiClient.patch<{ status: boolean; message: string; result: EmailTemplate }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch email template');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete email template');
    }
  }
}

const emailTemplateAPI = new EmailTemplateAPI();
export default emailTemplateAPI;