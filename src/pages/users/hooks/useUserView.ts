// src/pages/users/hooks/useUserView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import userAPI, { User } from "@/api/core/user";

export const useUserView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await userAPI.get(id);
      setUser(data);
    } catch (err: any) {
      showError(err.message || "Failed to load user details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setUser(null);
  };

  return {
    isOpen,
    loading,
    user,
    open,
    close,
  };
};