// src/pages/profile/hooks/useProfileForm.ts
import { Profile } from "@/api/core/profile";
import { useState } from "react";

type FormMode = "edit";

interface UseProfileFormReturn {
  isOpen: boolean;
  mode: FormMode;
  initialData: Partial<Profile> | null;
  openEdit: (profile: Profile) => void;
  close: () => void;
}

const useProfileForm = (): UseProfileFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState<Partial<Profile> | null>(null);

  const openEdit = (profile: Profile) => {
    setInitialData(profile);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setInitialData(null);
  };

  return {
    isOpen,
    mode: "edit",
    initialData,
    openEdit,
    close,
  };
};

export default useProfileForm;