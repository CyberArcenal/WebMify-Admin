// src/pages/experience/hooks/useExperienceForm.ts
import { Experience } from "@/api/core/experience";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseExperienceFormReturn {
  isOpen: boolean;
  mode: FormMode;
  experienceId: number | null;
  initialData: Partial<Experience> | null;
  openAdd: () => void;
  openEdit: (experience: Experience) => void;
  close: () => void;
}

const useExperienceForm = (): UseExperienceFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [experienceId, setExperienceId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<Experience> | null>(null);

  const openAdd = () => {
    setMode("add");
    setExperienceId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (experience: Experience) => {
    setMode("edit");
    setExperienceId(experience.id);
    setInitialData(experience);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setExperienceId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    experienceId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useExperienceForm;