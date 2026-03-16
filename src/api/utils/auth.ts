// src/api/auth.ts
import { authStore } from "@/lib/authStore";
import { apiClient } from "@/lib/fetcher";

export interface LoginRequest {
  username?: string;  // either username or email
  email?: string;
  password: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  status: string;
}

export interface LoginResponse {
  status: boolean;
  user: UserData;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  refresh: string;
  access: string;
  message: string;
}

// Verify token response types
export interface VerifySuccessResponse {
  valid: true;
  user: UserData;
  message: string;
}

export interface VerifyErrorResponse {
  valid: false;
  detail: string;
}

export type VerifyResponse = VerifySuccessResponse | VerifyErrorResponse;

class AuthAPI {
  /**
   * Log in using username/email and password.
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/login/', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>('/refresh/', { refresh: refreshToken });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Token refresh failed');
    }
  }

  /**
   * Verify if the current access token (or provided token) is valid.
   * @param token Optional token to verify. If not provided, uses the token from authStore (via interceptor).
   */
  async verify(token?: string): Promise<VerifyResponse> {
    try {
      // If a token is provided, we can either set it in the request body or in headers.
      // apiClient might already have an interceptor that adds the token from authStore.
      // For flexibility, we'll include it in the body if provided.
      const payload = token ? { token } : {};
      const response = await apiClient.post<VerifySuccessResponse>('/verify/', payload);
      return response.data;
    } catch (error: any) {
      // If the request fails (401, 400, etc.), we return the error detail from the response.
      const detail = error.response?.data?.detail || 'Token verification failed';
      return { valid: false, detail };
    }
  }

  /**
   * Log out – clears local storage (no server call needed for JWT).
   */
  logout(): void {
    authStore.clearAuth();
  }

  /**
   * Check if user is authenticated (token exists and not expired).
   */
  isAuthenticated(): boolean {
    return authStore.isAuthenticated();
  }
}

const authAPI = new AuthAPI();
export default authAPI;