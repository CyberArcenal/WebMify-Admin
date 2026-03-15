// src/pages/skills/hooks/useSkillView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import skillAPI, { Skill } from "@/api/core/skill";

export const useSkillView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState<Skill | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await skillAPI.get(id);
      setSkill(data);
    } catch (err: any) {
      showError(err.message || "Failed to load skill details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setSkill(null);
  };

  return {
    isOpen,
    loading,
    skill,
    open,
    close,
  };
};