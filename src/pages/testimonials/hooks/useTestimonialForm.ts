// src/pages/testimonials/hooks/useTestimonialForm.ts
import { Testimonial } from "@/api/core/testimonial";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseTestimonialFormReturn {
  isOpen: boolean;
  mode: FormMode;
  testimonialId: number | null;
  initialData: Partial<Testimonial> | null;
  openAdd: () => void;
  openEdit: (testimonial: Testimonial) => void;
  close: () => void;
}

const useTestimonialForm = (): UseTestimonialFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [testimonialId, setTestimonialId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<Testimonial> | null>(null);

  const openAdd = () => {
    setMode("add");
    setTestimonialId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setMode("edit");
    setTestimonialId(testimonial.id);
    setInitialData(testimonial);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTestimonialId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    testimonialId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useTestimonialForm;