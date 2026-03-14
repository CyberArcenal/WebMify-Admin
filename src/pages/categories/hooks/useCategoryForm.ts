// src/pages/categories/hooks/useCategoryForm.ts
import { Category } from "@/api/core/category";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseCategoryFormReturn {
  isOpen: boolean;
  mode: FormMode;
  categoryId: number | null;
  initialData: Partial<Category> | null;
  openAdd: () => void;
  openEdit: (category: Category) => void;
  close: () => void;
}

const useCategoryForm = (): UseCategoryFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<Category> | null>(null);

  const openAdd = () => {
    setMode("add");
    setCategoryId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (category: Category) => {
    setMode("edit");
    setCategoryId(category.id);
    setInitialData(category);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setCategoryId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    categoryId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useCategoryForm;