// src/pages/skills/hooks/useSkillForm.ts
import { Skill } from "@/api/core/skill";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseSkillFormReturn {
  isOpen: boolean;
  mode: FormMode;
  skillId: number | null;
  initialData: Partial<Skill> | null;
  openAdd: () => void;
  openEdit: (skill: Skill) => void;
  close: () => void;
}

const useSkillForm = (): UseSkillFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [skillId, setSkillId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<Skill> | null>(null);

  const openAdd = () => {
    setMode("add");
    setSkillId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setMode("edit");
    setSkillId(skill.id);
    setInitialData(skill);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSkillId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    skillId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useSkillForm;