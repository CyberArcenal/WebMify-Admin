// src/pages/testimonials/components/TestimonialFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import testimonialAPI, { Testimonial, TestimonialCreateData } from "@/api/core/testimonial";

interface TestimonialFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  testimonialId: number | null;
  initialData: Partial<Testimonial> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  author: string;
  author_title: string;
  content: string;
  rating: number;
  featured: boolean;
  author_image: FileList;
};

const TestimonialFormDialog: React.FC<TestimonialFormDialogProps> = ({
  isOpen,
  mode,
  testimonialId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      author: "",
      author_title: "",
      content: "",
      rating: 5,
      featured: false,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        author: initialData.author || "",
        author_title: initialData.author_title || "",
        content: initialData.content || "",
        rating: initialData.rating || 5,
        featured: initialData.featured || false,
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: TestimonialCreateData = {
        author: data.author,
        author_title: data.author_title,
        content: data.content,
        rating: data.rating,
        featured: data.featured,
      };

      // Handle file upload if present
      if (data.author_image && data.author_image.length > 0) {
        payload.author_image = data.author_image[0];
      }

      if (mode === "add") {
        if (!data.author || !data.author_title || !data.content) {
          throw new Error("Required fields are missing");
        }
        await testimonialAPI.create(payload);
        dialogs.success("Testimonial created successfully");
      } else {
        if (!testimonialId) throw new Error("Testimonial ID missing");
        await testimonialAPI.update(testimonialId, payload);
        dialogs.success("Testimonial updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save testimonial");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Testimonial" : "Edit Testimonial"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Author */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Author Name *
          </label>
          <input
            {...register("author", { required: "Author name is required" })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author.message}</p>}
        </div>

        {/* Author Title */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Author Title/Position *
          </label>
          <input
            {...register("author_title", { required: "Author title is required" })}
            className="compact-input w-full border rounded-md"
            placeholder="e.g., CEO, Client, Project Manager"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.author_title && <p className="text-xs text-red-500 mt-1">{errors.author_title.message}</p>}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Testimonial Content *
          </label>
          <textarea
            {...register("content", { required: "Content is required" })}
            rows={4}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Rating (1-5)
          </label>
          <select
            {...register("rating", { valueAsNumber: true })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Star{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Checkbox */}
        <div>
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
            <input type="checkbox" {...register("featured")} className="h-4 w-4" />
            Featured
          </label>
        </div>

        {/* Author Image */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Author Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("author_image")}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {initialData?.author_image_url && (
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Current image: {initialData.author_image_url.split("/").pop()}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "add" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TestimonialFormDialog;