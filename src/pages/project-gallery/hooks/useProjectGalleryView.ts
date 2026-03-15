// src/pages/project-gallery/hooks/useProjectGalleryView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import projectGalleryAPI, { ProjectGalleryImage } from "@/api/core/project_gallery";

export const useProjectGalleryView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ProjectGalleryImage | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await projectGalleryAPI.get(id);
      setImage(data);
    } catch (err: any) {
      showError(err.message || "Failed to load image details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setImage(null);
  };

  return {
    isOpen,
    loading,
    image,
    open,
    close,
  };
};