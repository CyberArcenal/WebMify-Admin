// src/pages/education/hooks/useEducationView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import educationAPI, { Education } from "@/api/core/education";

export const useEducationView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [education, setEducation] = useState<Education | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await educationAPI.get(id);
      setEducation(data);
    } catch (err: any) {
      showError(err.message || "Failed to load education details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setEducation(null);
  };

  return {
    isOpen,
    loading,
    education,
    open,
    close,
  };
};