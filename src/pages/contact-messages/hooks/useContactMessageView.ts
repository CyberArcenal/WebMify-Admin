// src/pages/contact-messages/hooks/useContactMessageView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import contactMessageAPI, { ContactMessage } from "@/api/core/contact_message";

export const useContactMessageView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<ContactMessage | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await contactMessageAPI.get(id);
      setMessage(data);
    } catch (err: any) {
      showError(err.message || "Failed to load message details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setMessage(null);
  };

  return {
    isOpen,
    loading,
    message,
    open,
    close,
  };
};