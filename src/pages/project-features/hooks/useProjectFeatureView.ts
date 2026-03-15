// src/pages/project-features/hooks/useProjectFeatureView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import projectFeatureAPI, { ProjectFeature } from "@/api/core/project_feature";

export const useProjectFeatureView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feature, setFeature] = useState<ProjectFeature | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await projectFeatureAPI.get(id);
      setFeature(data);
    } catch (err: any) {
      showError(err.message || "Failed to load feature details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setFeature(null);
  };

  return {
    isOpen,
    loading,
    feature,
    open,
    close,
  };
};