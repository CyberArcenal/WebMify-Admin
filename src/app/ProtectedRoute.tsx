// src/components/Shared/ProtectedRoute.tsx
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "@/lib/authStore";
import authAPI from "@/api/utils/auth";

const ProtectedRoute: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      // Step 1: Check if we have a locally non‑expired access token
      if (!authStore.isAuthenticated()) {
        // No valid access token – try to refresh using the refresh token
        const refreshToken = authStore.getRefreshToken();
        if (refreshToken) {
          try {
            const newAccessToken = await authStore.refreshToken();
            if (newAccessToken) {
              // Token refreshed – now verify with the server
              const verifyResult = await authAPI.verify();
              if (verifyResult.valid) {
                setIsValid(true);
                setIsVerifying(false);
                return;
              }
            }
          } catch (error) {
            console.error("Refresh failed", error);
          }
        }
        // No refresh token or refresh failed → not authenticated
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      // Step 2: We have a locally valid access token – verify it with the server
      const result = await authAPI.verify();
      if (result.valid) {
        setIsValid(true);
      } else {
        // Server says token is invalid (revoked, user inactive, etc.) – try refresh
        const refreshToken = authStore.getRefreshToken();
        if (refreshToken) {
          try {
            const newAccessToken = await authStore.refreshToken();
            if (newAccessToken) {
              // New tokens obtained – verify again to be safe
              const retryResult = await authAPI.verify();
              if (retryResult.valid) {
                setIsValid(true);
              } else {
                setIsValid(false);
              }
            } else {
              setIsValid(false);
            }
          } catch (error) {
            setIsValid(false);
          }
        } else {
          setIsValid(false);
        }
      }
      setIsVerifying(false);
    };

    verifyAuth();
  }, []);

  if (isVerifying) {
    // Show a loading indicator while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    // Clear any stale data and redirect to login
    authStore.clearAuth();
    return <Navigate to="/login" replace />;
  }

  // User is authenticated – render the child routes
  return <Outlet />;
};

export default ProtectedRoute;