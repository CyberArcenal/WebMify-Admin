// src/pages/project-techstacks/hooks/useProjectTechStackForm.ts
import { ProjectTechStack } from "@/api/core/project_techstack";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseProjectTechStackFormReturn {
  isOpen: boolean;
  mode: FormMode;
  itemId: number | null;
  initialData: Partial<ProjectTechStack> | null;
  openAdd: () => void;
  openEdit: (item: ProjectTechStack) => void;
  close: () => void;
}

const useProjectTechStackForm = (): UseProjectTechStackFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [itemId, setItemId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<ProjectTechStack> | null>(null);

  const openAdd = () => {
    setMode("add");
    setItemId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (item: ProjectTechStack) => {
    setMode("edit");
    setItemId(item.id);
    setInitialData(item);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setItemId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    itemId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useProjectTechStackForm;