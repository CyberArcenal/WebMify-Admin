// src/pages/blog/hooks/useBlogForm.ts
import { Blog } from "@/api/core/blog";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseBlogFormReturn {
  isOpen: boolean;
  mode: FormMode;
  blogId: number | null;
  initialData: Partial<Blog> | null;
  openAdd: () => void;
  openEdit: (blog: Blog) => void;
  close: () => void;
}

const useBlogForm = (): UseBlogFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [blogId, setBlogId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<Blog> | null>(null);

  const openAdd = () => {
    setMode("add");
    setBlogId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setMode("edit");
    setBlogId(blog.id);
    setInitialData(blog);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setBlogId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    blogId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useBlogForm;