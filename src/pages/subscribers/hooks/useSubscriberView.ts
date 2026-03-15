// src/pages/subscribers/hooks/useSubscriberView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import subscriberAPI, { Subscriber } from "@/api/core/subscriber";

export const useSubscriberView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await subscriberAPI.get(id);
      setSubscriber(data);
    } catch (err: any) {
      showError(err.message || "Failed to load subscriber details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setSubscriber(null);
  };

  return {
    isOpen,
    loading,
    subscriber,
    open,
    close,
  };
};