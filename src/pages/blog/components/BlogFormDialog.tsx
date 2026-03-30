// src/pages/blog/components/BlogFormDialog.tsx
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import { Upload, X } from "lucide-react";
import blogAPI, { Blog, BlogCreateData } from "@/api/core/blog";
import CategoryMultiSelect from "@/components/Selects/Muti/Category";

interface BlogFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  blogId: number | null;
  initialData: Partial<Blog> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "draft" | "published";
  featured: boolean;
  categories: number[];
};

const BlogFormDialog: React.FC<BlogFormDialogProps> = ({
  isOpen,
  mode,
  blogId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      status: "draft",
      featured: false,
      categories: [],
    },
  });

  const title = watch("title");
  const slug = watch("slug");
  const selectedCategories = watch("categories");

  // Auto-generate slug from title (only in add mode or if slug is empty)
  useEffect(() => {
    if (mode === "add" && title?.trim()) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-") 
        .replace(/^-+|-+$/g, ""); 

      setValue("slug", generatedSlug);
    }
  }, [mode, title, setValue]);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        slug: initialData.slug || "",
        content: initialData.content || "",
        excerpt: initialData.excerpt || "",
        status: initialData.status || "draft",
        featured: initialData.featured || false,
        categories: initialData.categories?.map((c) => c.id) || [],
      });
      if (initialData.featured_image_url) {
        setImagePreview(initialData.featured_image_url);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
    } else {
      reset();
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, reset]);

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      dialogs.error("Please select a valid image file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload: BlogCreateData = {
        title: data.title,
        slug: data.slug || undefined,
        content: data.content,
        excerpt: data.excerpt || undefined,
        status: data.status,
        featured: data.featured,
        categories: data.categories,
        featured_image: imageFile || undefined,
      };

      if (mode === "add") {
        if (!data.title) throw new Error("Title is required");
        await blogAPI.create(payload);
        dialogs.success("Blog created successfully");
      } else {
        if (!blogId) throw new Error("Blog ID missing");
        await blogAPI.update(blogId, payload);
        dialogs.success("Blog updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save blog");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Blog" : "Edit Blog"}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Title *
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
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
                placeholder="auto-generated from title"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>

            {/* Excerpt */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Excerpt
              </label>
              <textarea
                {...register("excerpt")}
                rows={2}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>

            {/* Content */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Content *
              </label>
              <textarea
                {...register("content", { required: "Content is required" })}
                rows={6}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
              {errors.content && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Featured Image */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Featured Image
              </label>
              <div
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-[var(--card-hover-bg)] transition-colors"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--card-secondary-bg)",
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload
                      className="w-8 h-8"
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Drag & drop an image here, or click to select
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Status
              </label>
              <select
                {...register("status")}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
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

            {/* Categories */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Categories
              </label>
              <CategoryMultiSelect
                value={selectedCategories}
                onChange={(ids) => setValue("categories", ids)}
              />
            </div>
          </div>
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

export default BlogFormDialog;
