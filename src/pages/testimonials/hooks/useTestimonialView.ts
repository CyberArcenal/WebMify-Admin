// src/pages/testimonials/hooks/useTestimonialView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import testimonialAPI, { Testimonial } from "@/api/core/testimonial";

export const useTestimonialView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await testimonialAPI.get(id);
      setTestimonial(data);
    } catch (err: any) {
      showError(err.message || "Failed to load testimonial details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setTestimonial(null);
  };

  return {
    isOpen,
    loading,
    testimonial,
    open,
    close,
  };
};