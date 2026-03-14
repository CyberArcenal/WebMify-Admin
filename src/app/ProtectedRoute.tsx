// src/components/Shared/ProtectedRoute.tsx
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  
  const [loading, setLoading] = useState(false);

  return <Outlet />;
};

export default ProtectedRoute;
