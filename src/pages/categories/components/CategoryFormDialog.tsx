// src/pages/categories/components/CategoryFormDialog.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import categoryAPI, { Category, CategoryCreateData } from "@/api/core/category";

interface CategoryFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  categoryId: number | null;
  initialData: Partial<Category> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  name: string;
  slug: string;
  description: string;
  featured: boolean;
};

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  isOpen,
  mode,
  categoryId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      featured: false,
    },
  });

  const name = watch("name");
  const slug = watch("slug");

  // Auto-generate slug from name (only in add mode or if slug is empty)
  useEffect(() => {
    if (mode === "add" && name && !slug) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", generatedSlug);
    }
  }, [name, mode, setValue, slug]);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        featured: initialData.featured || false,
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: CategoryCreateData = {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        featured: data.featured,
      };

      if (mode === "add") {
        if (!data.name) throw new Error("Category name is required");
        await categoryAPI.create(payload);
        dialogs.success("Category created successfully");
      } else {
        if (!categoryId) throw new Error("Category ID missing");
        await categoryAPI.update(categoryId, payload);
        dialogs.success("Category updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save category");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Category" : "Edit Category"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Category Name *
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Slug
          </label>
          <input
            {...register("slug")}
            className="compact-input w-full border rounded-md"
            placeholder="auto-generated from name"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>

        {/* Featured Checkbox */}
        <div>
          <label
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--sidebar-text)" }}
          >
            <input
              type="checkbox"
              {...register("featured")}
              className="h-4 w-4"
            />
            Featured
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              if (
                !(await dialogs.confirm({
                  title: "Cancel Form",
                  message:
                    "Are you sure do you want to cancel this form your data may be loss?.",
                  confirmText: "Cancel Anyway",
                }))
              )
                return;

              onClose();
            }}
          >
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

export default CategoryFormDialog;
