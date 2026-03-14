// src/pages/projects/hooks/useProjectForm.ts
import { Project } from "@/api/core/project";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseProjectFormReturn {
  isOpen: boolean;
  mode: FormMode;
  projectId: number | null;
  initialData: Partial<Project> | null;
  openAdd: () => void;
  openEdit: (project: Project) => void;
  close: () => void;
}

const useProjectForm = (): UseProjectFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [projectId, setProjectId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<Project> | null>(null);

  const openAdd = () => {
    setMode("add");
    setProjectId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (project: Project) => {
    setMode("edit");
    setProjectId(project.id);
    setInitialData(project);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setProjectId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    projectId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useProjectForm;