// src/pages/experience/hooks/useExperienceView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import experienceAPI, { Experience } from "@/api/core/experience";

export const useExperienceView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await experienceAPI.get(id);
      setExperience(data);
    } catch (err: any) {
      showError(err.message || "Failed to load experience details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setExperience(null);
  };

  return {
    isOpen,
    loading,
    experience,
    open,
    close,
  };
};