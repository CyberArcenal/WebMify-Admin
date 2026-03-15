// src/pages/project-features/hooks/useProjectFeatureForm.ts
import { ProjectFeature } from "@/api/core/project_feature";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseProjectFeatureFormReturn {
  isOpen: boolean;
  mode: FormMode;
  featureId: number | null;
  initialData: Partial<ProjectFeature> | null;
  openAdd: () => void;
  openEdit: (feature: ProjectFeature) => void;
  close: () => void;
}

const useProjectFeatureForm = (): UseProjectFeatureFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [featureId, setFeatureId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<ProjectFeature> | null>(null);

  const openAdd = () => {
    setMode("add");
    setFeatureId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (feature: ProjectFeature) => {
    setMode("edit");
    setFeatureId(feature.id);
    setInitialData(feature);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setFeatureId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    featureId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useProjectFeatureForm;