// src/pages/project-gallery/hooks/useProjectGalleryForm.ts
import { ProjectGalleryImage } from "@/api/core/project_gallery";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseProjectGalleryFormReturn {
  isOpen: boolean;
  mode: FormMode;
  imageId: number | null;
  initialData: Partial<ProjectGalleryImage> | null;
  openAdd: () => void;
  openEdit: (image: ProjectGalleryImage) => void;
  close: () => void;
}

const useProjectGalleryForm = (): UseProjectGalleryFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [imageId, setImageId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<ProjectGalleryImage> | null>(null);

  const openAdd = () => {
    setMode("add");
    setImageId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (image: ProjectGalleryImage) => {
    setMode("edit");
    setImageId(image.id);
    setInitialData(image);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setImageId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    imageId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useProjectGalleryForm;