// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authStore } from "@/lib/authStore";
import { name, version } from "../../../../package.json";
import authAPI from "@/api/utils/auth";
import { showError } from "@/utils/notification";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved email if "remember me" was checked previously
  useEffect(() => {
    const savedIdentifier = localStorage.getItem("remembered_identifier");
    if (savedIdentifier) {
      setIdentifier(savedIdentifier);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.login({
        username: identifier,
        email: identifier,
        password,
      });
      authStore.setAuthData({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: 3600,
      });

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("remembered_identifier", identifier);
      } else {
        localStorage.removeItem("remembered_identifier");
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
      showError("Login Failed")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background-color)]">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary-color)] text-white mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--sidebar-text)]">PortMify</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Sign in to manage your content</p>
        </div>

        {/* Login Card */}
        <div
          className="compact-card rounded-xl p-6 md:p-8 shadow-xl"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-start gap-2 bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email/Username Field */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />
                </div>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="compact-input w-full pl-10! pr-3! py-2! rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  style={{
                    background: "var(--input-bg)",
                    color: "var(--input-text)",
                    borderColor: "var(--input-border)",
                  }}
                  placeholder="Enter your email or username"
                />
              </div>
            </div>

            {/* Password Field with Toggle */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="compact-input w-full pl-10! pr-10! py-2! rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  style={{
                    background: "var(--input-bg)",
                    color: "var(--input-text)",
                    borderColor: "var(--input-border)",
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  style={{
                    accentColor: "var(--primary-color)",
                  }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm"
                  style={{ color: "var(--sidebar-text)" }}
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium hover:underline"
                  style={{ color: "var(--primary-color)" }}
                  onClick={(e) => e.preventDefault()} // Placeholder for forgot password
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              © {new Date().getFullYear()} {name} Admin. {version} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;