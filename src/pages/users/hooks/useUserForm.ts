// src/pages/users/hooks/useUserForm.ts
import { User } from "@/api/core/user";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseUserFormReturn {
  isOpen: boolean;
  mode: FormMode;
  userId: number | null;
  initialData: Partial<User> | null;
  openAdd: () => void;
  openEdit: (user: User) => void;
  close: () => void;
}

const useUserForm = (): UseUserFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [userId, setUserId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<User> | null>(null);

  const openAdd = () => {
    setMode("add");
    setUserId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (user: User) => {
    setMode("edit");
    setUserId(user.id);
    setInitialData(user);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setUserId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    userId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useUserForm;