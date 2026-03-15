// src/pages/email-templates/hooks/useEmailTemplateView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import emailTemplateAPI, { EmailTemplate } from "@/api/core/email_template";

export const useEmailTemplateView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<EmailTemplate | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await emailTemplateAPI.get(id);
      setTemplate(data);
    } catch (err: any) {
      showError(err.message || "Failed to load template details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setTemplate(null);
  };

  return {
    isOpen,
    loading,
    template,
    open,
    close,
  };
};