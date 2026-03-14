// src/lib/authStore.ts
import { showConfirm } from "@/utils/dialogs";
import { showError, showInfo } from "@/utils/notification";
import { global_base_url } from "./global";

// Minimal user data from portfolio backend
export interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;      // "viewer", "customer", "staff", "manager", "admin"
  status: string;         // "active", etc.
}

export const EMPTY_USER: UserData = {
  id: 0,
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  user_type: "",
  status: "",
};

export interface AuthData {
  user: UserData;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until expiry (derived from token)
}

export interface AuthState {
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

type AuthChangeCallback = (isAuthenticated: boolean) => void;

// Helper to decode JWT payload (no library needed)
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getExpirationFromToken(token: string): number {
  const payload = decodeJwt(token);
  if (payload && payload.exp) {
    return payload.exp * 1000; // convert seconds to milliseconds
  }
  return Date.now() + 5 * 60 * 1000; // fallback: 5 minutes
}

export class AuthStore {
  private readonly APP_NAME = "PORTFOLIO";
  private readonly ACCESS_TOKEN_KEY = `${this.APP_NAME}_access_token`;
  private readonly REFRESH_TOKEN_KEY = `${this.APP_NAME}_refresh_token`;
  private readonly USER_DATA_KEY = `${this.APP_NAME}_user_data`;
  private readonly TOKEN_EXPIRATION_KEY = `${this.APP_NAME}_token_expiration`;
  private notifying = false;

  /**
   * Save auth data into localStorage and notify subscribers.
   */
  setAuthData(data: AuthData): boolean {
    try {
      // Compute expiration from token if not provided reliably
      const expirationTime = getExpirationFromToken(data.accessToken);
      localStorage.setItem(this.ACCESS_TOKEN_KEY, data.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(data.user));
      localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expirationTime.toString());

      this.notifyAuthChange();
      console.log("Saved auth for:", data.user.username);
      return true;
    } catch (err: any) {
      console.error("Error saving auth data:", err);
      showError("Failed to save authentication data");
      return false;
    }
  }

  /**
   * Dispatch a custom event when auth state changes.
   */
  private notifyAuthChange(): void {
    if (this.notifying) return;
    this.notifying = true;

    const event = new CustomEvent("authStateChanged", {
      detail: { authenticated: this.isAuthenticated() },
    });
    document.dispatchEvent(event);

    this.notifying = false;
  }

  /**
   * Get the current authentication snapshot.
   */
  getState(): AuthState {
    return {
      user: this.getUser(),
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
      isAuthenticated: this.isAuthenticated(),
    };
  }

  /**
   * Return the stored access token, if not expired.
   */
  getAccessToken(): string | null {
    if (this.isTokenExpired()) {
      console.warn("Access token expired");
      return null;
    }
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Return the stored refresh token.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Parse and return the current user object.
   */
  getUser(): UserData {
    const raw = localStorage.getItem(this.USER_DATA_KEY);
    if (!raw) return EMPTY_USER;

    try {
      return JSON.parse(raw) as UserData;
    } catch (err: any) {
      console.error("Error parsing user data:", err);
      showError("Failed to retrieve user data");
      return EMPTY_USER;
    }
  }

  // Role checks based on user_type string
  isStaff(): boolean {
    const user = this.getUser();
    return user.user_type === "staff";
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user.user_type === "admin";
  }

  isManager(): boolean {
    const user = this.getUser();
    return user.user_type === "manager";
  }

  isViewer(): boolean {
    const user = this.getUser();
    return user.user_type === "viewer";
  }

  isCustomer(): boolean {
    const user = this.getUser();
    return user.user_type === "customer";
  }

  /**
   * Check if a user is currently authenticated.
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!token && !!user && !this.isTokenExpired();
  }

  /**
   * Determine if the stored access token is expired.
   */
  isTokenExpired(): boolean {
    const exp = localStorage.getItem(this.TOKEN_EXPIRATION_KEY);
    if (!exp) return true;
    return Date.now() >= parseInt(exp, 10);
  }

  /**
   * Call API to refresh the access token.
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await fetch(`${global_base_url()}/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      const data = await response.json();
      const { access, refresh } = data as { access: string; refresh: string };

      // Update tokens and recompute expiration from new access token
      const expirationTime = getExpirationFromToken(access);
      localStorage.setItem(this.ACCESS_TOKEN_KEY, access);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
      localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expirationTime.toString());

      this.notifyAuthChange();
      console.log("Tokens updated successfully");
      return access;
    } catch (error: any) {
      if (error.message === "401") {
        showInfo("Session expired — you have been logged out.");
        this.clearAuth();
        window.location.hash = "/login";
      } else {
        console.error("Token refresh error:", error);
      }
      return null;
    }
  }

  /**
   * Clear all stored authentication data.
   */
  clearAuth(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);

    this.notifyAuthChange();
    console.log("Authentication data cleared");
  }

  /**
   * Log out the user and redirect to login.
   */
  logout(): void {
    this.clearAuth();
    window.location.hash = "/login";
  }

  async makeLogOut(): Promise<boolean> {
    const confirmed = await showConfirm({
      title: "Log out?",
      message: "Are you sure you want to log out?",
      icon: "warning",
      confirmText: "Yes, continue",
      cancelText: "Cancel",
    });

    if (!confirmed) return false;
    this.logout();
    return true;
  }

  /**
   * Subscribe to cross-tab auth state changes.
   */
  subscribe(callback: AuthChangeCallback): void {
    window.addEventListener("storage", (e: StorageEvent) => {
      if (
        e.key === this.ACCESS_TOKEN_KEY ||
        e.key === this.TOKEN_EXPIRATION_KEY ||
        e.key === this.USER_DATA_KEY
      ) {
        callback(this.isAuthenticated());
      }
    });
  }
}

export const authStore = new AuthStore();