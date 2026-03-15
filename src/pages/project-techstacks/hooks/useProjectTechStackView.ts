// src/pages/project-techstacks/hooks/useProjectTechStackView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import projectTechStackAPI, { ProjectTechStack } from "@/api/core/project_techstack";

export const useProjectTechStackView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<ProjectTechStack | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await projectTechStackAPI.get(id);
      setItem(data);
    } catch (err: any) {
      showError(err.message || "Failed to load tech stack details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setItem(null);
  };

  return {
    isOpen,
    loading,
    item,
    open,
    close,
  };
};