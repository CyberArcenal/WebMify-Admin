// src/pages/education/hooks/useEducationForm.ts
import { Education } from "@/api/core/education";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseEducationFormReturn {
  isOpen: boolean;
  mode: FormMode;
  educationId: number | null;
  initialData: Partial<Education> | null;
  openAdd: () => void;
  openEdit: (education: Education) => void;
  close: () => void;
}

const useEducationForm = (): UseEducationFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [educationId, setEducationId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<Education> | null>(null);

  const openAdd = () => {
    setMode("add");
    setEducationId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (education: Education) => {
    setMode("edit");
    setEducationId(education.id);
    setInitialData(education);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEducationId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    educationId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useEducationForm;