// src/pages/email-templates/hooks/useEmailTemplateForm.ts
import { EmailTemplate } from "@/api/core/email_template";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseEmailTemplateFormReturn {
  isOpen: boolean;
  mode: FormMode;
  templateId: number | null;
  initialData: Partial<EmailTemplate> | null;
  openAdd: () => void;
  openEdit: (template: EmailTemplate) => void;
  close: () => void;
}

const useEmailTemplateForm = (): UseEmailTemplateFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<EmailTemplate> | null>(null);

  const openAdd = () => {
    setMode("add");
    setTemplateId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (template: EmailTemplate) => {
    setMode("edit");
    setTemplateId(template.id);
    setInitialData(template);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTemplateId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    templateId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useEmailTemplateForm;